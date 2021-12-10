// Потом удалить
window.addEventListener('DOMContentLoaded', () => {


    document.querySelectorAll('[data-for-popup]').forEach(button => {

        button.addEventListener('click', e => {
            e.preventDefault();

            const popupType = button.dataset.forPopup;
            const popup = document.querySelector(`[data-popup=${popupType}]`);
            const form = popup.querySelector('form');

            openPopup(popupType)

            if (form && popupType === 'certificate') {
                form.addEventListener('submit', approveCertificate)
            }
        })
    });

    document.querySelectorAll('[data-js=popup-close]').forEach(closeBtn => {
        closeBtn.addEventListener('click', closePopup)
    });

    document.querySelectorAll('.lk-popup').forEach(el => {
        el.addEventListener('click', e => {
            const activeElement = document.activeElement;
            const inputs = ['input', 'select', 'button', 'textarea'];

            if (!e.target.classList.contains('lk-popup--active')) {
                return
            }

            if (activeElement && inputs.indexOf(activeElement.tagName.toLowerCase()) !== -1) {
                return
            }

            closePopup()
        })
    });
});

const closePopup = () => {
    const activeForm = document.querySelector('.lk-popup--active');
    const form = activeForm.querySelector('form');
    const labelEvaluations = activeForm.querySelectorAll('.lk-popup__evaluations-label');

    activeForm.classList.remove('lk-popup--active');

    if (activeForm.getAttribute('data-popup') === 'signature-warning') {
        window.location.reload()
    }

    if (!form) {
        return
    }

    form.reset();

    labelEvaluations.forEach(el => {
        if (el.classList.contains('lk-popup__evaluations-label--selected')) {
            el.classList.remove('lk-popup__evaluations-label--selected')
        }
    })
};

const openPopup = (dataPopup) => {
    const popup = document.querySelector(`[data-popup="${dataPopup}"]`);
    const form = popup.querySelector('form');

    if (!popup && !form) {
        return
    }

    popup.classList.add('lk-popup--active')

    if ( dataPopup === 'certificate') {
        form.addEventListener('submit', approveCertificate)
    }

};
// Потом удалить

certificateSwitch = () => {
    const certificateInputs = document.querySelectorAll('[data-js=certificate-input]')
    const certificateLabels = document.querySelectorAll('[data-js=certificate-label]')

    if (certificateInputs && certificateLabels) {
        uncheckedLabels = () => {
            certificateLabels.forEach(label => {
                label.dataset.state = 'unchecked'
            })
        }

        certificateInputs.forEach((input) => {
            input.addEventListener("change", function (event) {
                uncheckedLabels()
                const label = event.target.parentNode
                label.dataset.state = 'checked';
                // eds.setSelectCertificat(event.target.value);
            });
        });
    }
}

approveCertificate = (event) => {
    event.preventDefault()
    let b64 = $('#agreement64').html();
    let id = $('#agreement64').attr('data-file-id');
    if(eds.selectedCert === ''){
        window.closeSigningAcceptPopup();
        return false;
    }
    closePopup();
    window.toggleSigningAcceptPopup();
    eds.signFileServer(b64, id);

    $('.annex64').each( function(index, val) {
        let b64 = $(this).html();
        let id = $(this).attr('data-file-id');
        eds.signFileServer(b64, id);
    });
    const activeForm = document.querySelector('.lk-popup--active');

    activeForm.classList.remove('lk-popup--active');
}

$(document).ready(function() {
    let eds = new Eds('CertListBox');
    let ajaxObj = {
        'status': $('#status').attr('data-status'),
        'docs': []
    };

    function sendRequest() {
        // console.log(ajaxObj);
        $.ajax({
            type: "POST",
            url: "",
            data: ajaxObj,
            success: function(msg){
                window.location.reload();
            }
        });
    }

    $('#CertListBox').click(function (event) {
        if(event.target.nodeName == 'INPUT'){
            eds.setSelectCertificat(event.target.value);
        }
    });

    function getStateOfCheckboxInSigningForm(){
        return $('.th-subscription-table').find('input[name="assept-viewing"]').is(':checked');
    }
    window.getStateOfCheckboxInSigningForm = getStateOfCheckboxInSigningForm;

    $('#signinig').click(function () {
        if(!window.getStateOfCheckboxInSigningForm()){
            // alert(' Подтвердите, что вы просмотрели все подписываемые документы');
            window.closeSigningAcceptPopup();
            return false;
        }

        openPopup('certificate');
        // certificateSwitch()
    });

    certificateSwitchEvent = function (a) {
        certificateSwitch();
        $('#waiting-certificate').hide();
    };

    $('input[name="assept-viewing"]').change(function () {
        if (this.checked){
            $('#signinig').removeAttr('disabled');
        }else{
            $('#signinig').attr('disabled', 'disabled');
        }
    });

    window.popUpOpen = 0;
    signFileOk = function (sign, id, certInfo) {
        if(window.popUpOpen == 0){
            window.popUpOpen++;
            // window.toggleSigningAcceptPopup();
        }
    };

    signFileError = function (sign, id, certInfo) {
        window.closeSigningAcceptPopup();
    };

    singingFileException  = function (sign) {
        window.closeSigningAcceptPopup();
        if (sign){
            $('#exceptions').html('Ошибка: ' + sign);
        }
        $('.lk-warning-card-exception').css('display', 'flex');

        $('#button-panel').hide();
    };

    checkFIO = function(certInfo){
        let lastName = $('#ssss').attr('data-last-name');
        let firstName = $('#ssss').attr('data-first-name');
        let middleName = $('#ssss').attr('data-middle-name');
        let statusId = $('#ssss').attr('data-status');

        //Проверка при пустом поле фамилия
        if(!lastName || lastName == 'undefined'){
            return true;
        }

        if(statusId != '566') {
            return true;
        }
        if(certInfo.SubjectName.indexOf(lastName) === -1) {
            console.log('Фамилия не найдена');
            return false;
        }
        if(certInfo.SubjectName.indexOf(firstName) === -1) {
            console.log('имя не найдено');
            return false;
        }
        if(certInfo.SubjectName.indexOf(middleName) === -1) {
            console.log('Отчество не найдено');
            return false;
        }
        return true;
    };

    signFile = function (sign, id, certInfo) {
        ajaxObj.docs.push({
            'id': id,
            'certInfo': certInfo,
            'sign': sign
        });
        if ($('.annex64').length + 1 == ajaxObj.docs.length){
            if (checkFIO(certInfo)) {
                sendRequest();
            } else {
                window.toggleSigningAcceptPopup();
                openPopup('signature-warning');
            }
        }
    };

    $('#reject_button').click(function () {
        // delete ajaxObj.status;
        ajaxObj.reject = 1;
        ajaxObj.comment = $('.th-popup__textarea').val();
        if(ajaxObj.comment.length < 20){
            alert('Вы не указали причину отказа. Не менее 20 символов.');
            return false;
        }
        window.toggleSigningAcceptPopup();
        sendRequest();
    });

});

