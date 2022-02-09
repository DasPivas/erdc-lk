$( document ).ready((function () {
    $('[name="JOBS_ALL[actualWorkplaces][]"]').each(function () {
        this.validator = function ($form) {
            var planned = 0;
            $form.find('[name="JOBS_ALL[plannedWorkplaces][]"]').each(function (i, e) {
                planned += parseInt(e.value);
            });
            if (planned > 0 && planned < parseInt(this.value)) {
                alert("Применение пониженного тарифа на социальные взносы возможно только на количество рабочих мест указанное в соглашении!");
            }
            return true;
        };
    });
    $('[name="JOBS_HI_PERF[actualHighPerformanceJobs][]"]').each(function () {
        this.validator = function ($form, $field, validError) {
            var total = 0;
            $form.find('[name="JOBS_EMPLOYED[actualEmployed][]"]').each(function (i, e) {
                total += +e.value;
            });
            if (total < +this.value) {
                validError.push({
                    field: $field,
                    error: "Количество созданных высокопроизводительных рабочих мест не должно превышать количество трудоустроенных сотрудников!"
                });
            }
            return (total >= +this.value);
        };
    });
    $('[name="JOBS_FOREIGN[actualForeignWorkers][]"]').each(function () {
        this.validator = function ($form, $field, validError) {
            var total = 0;
            $form.find('[name="JOBS_EMPLOYED[actualEmployed][]"]').each(function (i, e) {
                total += +e.value;
            });
            if (total < +this.value) {
                validError.push({
                    field: $field,
                    error: "Количество созданных рабочих мест, замещенных иностранными работниками, не должно превышать количество трудоустроенных сотрудников!"
                });
            }
            return (total >= +this.value);
        };
    });
    $('[name="exportVolume"]').each(function () {
        this.validator = function ($form, $field, validError) {
            var total = 0;
            var thisValue = parseFloat(this.value.replace(',', '.'));

            $form.find('[name="salesVolume"]').each(function (i, e) {
                total += parseFloat(e.value.replace(',', '.'));
            });
            if (total < thisValue) {
                validError.push({field: $field, error: "Объем экспорта не должен превышать общего объема реализации!"});
            }
            return (total >= thisValue || (isNaN(total) && isNaN(thisValue)) || (!isNaN(total) && isNaN(thisValue)));
        };
    });
    $('[name="productionCosts"]').each(function () {
        this.validator = function ($form, $field, validError) {
            var laborCosts = 0;
            var depreciationCosts = 0;
            var extrabudgetaryCosts = 0;
            var thisValue = parseFloat(this.value.replace(',', '.'));

            $form.find('[name="laborCosts"]').each(function (i, e) {
                laborCosts = parseFloat(e.value.replace(',', '.'));
            });
            $form.find('[name="depreciationCosts"]').each(function (i, e) {
                depreciationCosts = parseFloat(e.value.replace(',', '.'));
            });
            $form.find('[name="extrabudgetaryCosts"]').each(function (i, e) {
                extrabudgetaryCosts = parseFloat(e.value.replace(',', '.'));
            });
            // if (isNaN(laborCosts) && isNaN(depreciationCosts)) {
            //     return true;

            if (isNaN(depreciationCosts) && !isNaN(laborCosts + thisValue)) {
                if (thisValue < laborCosts) {
                    validError.push({
                        field: $field,
                        error: "Общие расходы не должны быть меньше расходоа на оплату труда!"
                    });
                    return false;
                }
            } else if (isNaN(laborCosts) && !isNaN(depreciationCosts + thisValue)) {
                if (thisValue < depreciationCosts) {
                    validError.push({
                        field: $field,
                        error: "Общие расходы не должны быть меньше расходов на амортизацию!"
                    });
                    return false;
                }
            } else if (!isNaN(extrabudgetaryCosts + thisValue)) {
                if (thisValue < extrabudgetaryCosts) {
                    validError.push({
                        field: $field,
                        error: "Общие расходы не должны быть меньше расходов связанных с отчислением в гос.внебюджетные фонды!"
                    });
                    return false;
                }
            } else if (!isNaN(laborCosts + thisValue + depreciationCosts)) {
                if (thisValue < (laborCosts + depreciationCosts)) {
                    validError.push({
                        field: $field,
                        error: "Общие расходы не должны быть меньше суммы расходов на оплату труда и амортизации!"
                    });
                    return false;
                }
            }
            return true;
        };
    });
    $('[name="otherInvestments"]').each(function () {
        this.onkeyup = function () {
            var value = parseFloat(($(this).val() + '').replace(',', '.'));
            $('[name="actualCapitalInvestment"]').each(function (i, e) {
                value += parseFloat(e.value.replace(',', '.'));
            });
            if ($.isNumeric(value)) {
                $('[name="actualInvestment"]').each(function (i, e) {
                    e.value = parseFloat(value.toFixed(2));
                });
            }
        }
    });
    $('[name="actualCapitalInvestment"]').each(function () {
        this.onkeyup = function () {
            var value = parseFloat(($(this).val() + '').replace(',', '.'));
            $('[name="otherInvestments"]').each(function (i, e) {
                value += parseFloat(e.value.replace(',', '.'));
            });
            if ($.isNumeric(value)) {
                $('[name="actualInvestment"]').each(function (i, e) {
                    e.value = parseFloat(value.toFixed(2));
                });
            }
        }
    });
}));