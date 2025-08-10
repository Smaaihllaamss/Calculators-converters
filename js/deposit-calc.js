'use strick';

const calcBtn = document.getElementById('depositCalcBtn');
const resetBtn = document.getElementById('depositResetBtn');

calcBtn.addEventListener('click', () => {
  const depositAmount = parseFloat(
    document.getElementById('depositAmount').value.trim()
  );
  const annualRate = parseFloat(
    document.getElementById('interestRate').value.trim()
  );
  const termYears = parseInt(document.getElementById('termYears').value.trim());
  const termMonths = parseInt(
    document.getElementById('termMonths').value.trim()
  );

  const addFundsCheckbox = document.getElementById('addFundsCheckbox');
  const addFundsInput = document.getElementById('depositMonthlyAddition');
  if (!addFundsCheckbox.checked) {
    addFundsInput.value = 0;
  }
  const monthlyAddition = parseFloat(addFundsInput.value.trim());

  const taxRateCheckbox = document.getElementById('calcInclusiveTaxesCheckbox');
  const taxRateInput = document.getElementById('taxRate');
  if (!taxRateCheckbox.checked) {
    taxRateInput.value = 0;
  }
  const taxRate = parseFloat(taxRateInput.value.trim());

  const depositAmountError = document.getElementById('depositAmountError');
  const interestRateError = document.getElementById('interestRateError');
  const termYearsError = document.getElementById('termYearsError');
  const termMonthsError = document.getElementById('termMonthsError');
  const monthlyAdditionError = document.getElementById('monthlyAdditionError');
  const taxRateError = document.getElementById('taxRateError');

  const finalBalanceOut = document.getElementById('finalBalanceOut');
  const investedOut = document.getElementById('investedOut');
  const annualRateOut = document.getElementById('interestRateOut');
  const rateAfterTaxesOut = document.getElementById('rateAfterTaxesOut');
  const taxesOut = document.getElementById('taxesOut');

  const compoundPerYear = getCompoundValue();

  const isValid =
    validateDepositInput(
      depositAmount,
      (value) => isValidNumber(value) && value > 0 && value < 50000001,
      depositAmountError,
      'The deposit amount must be between 0 and 50 000 000.'
    ) &&
    validateDepositInput(
      annualRate,
      (value) => isValidNumber(value) && value > 0,
      interestRateError,
      'The interest rate must be a positive number.'
    ) &&
    validateDepositInput(
      compoundPerYear,
      (value) => isValidNumber(value) && value >= 0,
      compoundError,
      'Incorrect Compound Frequency.'
    ) &&
    validateDepositInput(
      termYears,
      (value) => isValidNumber(value) && value >= 0,
      termYearsError,
      'The number of years must be a positive number.'
    ) &&
    validateDepositInput(
      termMonths,
      (value) => isValidNumber(value) && value >= 0 && value < 11,
      termMonthsError,
      'The number of months must be between 0 and 11.'
    ) &&
    validateDepositInput(
      monthlyAddition,
      (value) => isValidNumber(value) && value >= 0,
      monthlyAdditionError,
      'The deposit monthly addition must be a positive number.'
    ) &&
    validateDepositInput(
      taxRate,
      (value) => isValidNumber(value) && value >= 0 && value < 100,
      taxRateError,
      'The tax should be between 0 and 100%.'
    );

  if (!isValid) {
    console.log('Validation failed. Stopping further calculations.');
    return;
  }

  const totalMonths = calcTotalMonths(termYears, termMonths);
  const totalPeriods = calcTotalPeriods(termYears, termMonths, compoundPerYear);
  const compoundInterval = calcCompoundInterval(compoundPerYear);
  const compoundRate = calcCompoundRate(annualRate, compoundPerYear);

  const totalDepositAmount = calcTotalDepositAmount(
    depositAmount,
    monthlyAddition,
    totalMonths
  );

  const depositProfit = calcDepositProfit(
    depositAmount,
    totalPeriods,
    compoundRate,
    taxRate
  );

  const additionProfit = calcAdditionProfit(
    totalMonths,
    monthlyAddition,
    compoundInterval,
    compoundRate,
    taxRate
  );

  const totalProfit = calcTotalProfit(depositProfit, additionProfit);

  const depositTax = calcDepositTax(
    depositAmount,
    totalPeriods,
    compoundRate,
    taxRate
  );

  const additionTax = calcAdditionTax(
    totalMonths,
    monthlyAddition,
    compoundInterval,
    compoundRate,
    taxRate
  );

  const totalTaxes = calcTotalTaxes(depositTax, additionTax);

  const result = calcFinalBalance(totalDepositAmount, totalProfit);
  const roundedResult = result.toFixed(2);

  const roundedTotalTaxes = totalTaxes.toFixed(2);

  const rateAfterTaxes = calcRateAfterTaxes(annualRate, taxRate);
  const roundedRateAfterTaxes = rateAfterTaxes.toFixed(2);

  //Data output fields
  finalBalanceOut.innerText = String(roundedResult).replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ' '
  );

  investedOut.innerText = String(totalDepositAmount).replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ' '
  );

  annualRateOut.innerText = `${annualRate}% per annum`;
  rateAfterTaxesOut.innerText = `${roundedRateAfterTaxes} %`;

  taxesOut.innerText = String(roundedTotalTaxes).replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ' '
  );

  console.log('📥 Входные данные:');
  console.table({
    'Deposit Amount': depositAmount,
    'Annual Interest Rate (%)': annualRate,
    'Term (years)': termYears,
    'Term (months)': termMonths,
    'Add Funds to Deposit': monthlyAddition,
    'Tax Rate (%)': taxRate,
    'Compound per Year': compoundPerYear,
  });

  console.log('📊 Calculation parameters:');
  console.table({
    'Total number of months': totalMonths,
    'Total number of capitalization periods': totalPeriods,
    'Capitalization interval (months)': compoundInterval,
    'Interest Rate for the period': compoundRate.toFixed(6),
  });

  console.log('💰 Results:');
  console.table({
    'Total amount of investments': totalDepositAmount.toFixed(2),
    // 'Profit from the principal investment': depositProfit.toFixed(2),
    // 'Profit from monthly additions': additionProfit.toFixed(2),
    'Total profit after taxes': totalProfit.toFixed(2),
    // 'Tax on the principal deposit': depositTax.toFixed(2),
    // 'Tax on monthly additions': additionTax.toFixed(2),
    'Total tax': totalTaxes.toFixed(2),
    'Final balance': result.toFixed(2),
  });
});

// Get Value of compoundPerYear
function getCompoundValue() {
  const compoundInput = String(document.getElementById('compound').value);
  let value;

  if (compoundInput === 'Monthly') {
    value = 12;
  } else if (compoundInput === 'Quarterly') {
    value = 4;
  } else if (compoundInput === 'Semiannually') {
    value = 2;
  } else if (compoundInput === 'Annually') {
    value = 1;
  } else {
    value = 1;
  }

  console.log('compoundValue:', value);
  return value;
}

//Validation of input field values
function validateDepositInput(value, condition, errorElement, errorMessage) {
  if (!condition(value)) {
    errorElement.innerText = errorMessage;
    return false;
  } else {
    errorElement.innerText = '';
    return true;
  }
}

function isValidNumber(value) {
  const num = value;
  return !isNaN(num) && isFinite(num);
}

function round(value) {
  return Math.round(value * 100) / 100;
}

function calcTotalMonths(termYears, termMonths) {
  return termYears * 12 + termMonths;
}

function calcTotalPeriods(termYears, termMonths, compoundPerYear) {
  return termYears * compoundPerYear + (termMonths / 12) * compoundPerYear;
}

function calcCompoundInterval(compoundPerYear) {
  return 12 / compoundPerYear;
}

function calcCompoundRate(annualRate, compoundPerYear) {
  return annualRate / 100 / compoundPerYear;
}

function calcTotalDepositAmount(depositAmount, monthlyAddition, totalMonths) {
  return depositAmount + monthlyAddition * (totalMonths - 1);
}

/*Calc Profit after Taxes
 * Logic: If the “Calculate inclusive of taxes” checkbox is not selected, taxes are not deducted.
 */

function calcDepositProfit(depositAmount, totalPeriods, compoundRate, taxRate) {
  let depBalance = depositAmount;
  let depProfit = 0;

  for (let i = 1; i <= totalPeriods; i++) {
    const interest = depBalance * compoundRate; //accrued interest
    const tax = interest * (taxRate / 100); //interest tax
    const netInterest = interest - tax; //net interest after tax

    depBalance += netInterest;
    depProfit += netInterest;
  }

  return depProfit;
}

function calcAdditionProfit(
  totalMonths,
  monthlyAddition,
  compoundInterval,
  compoundRate,
  taxRate
) {
  let addBalance = 0;
  let addProfit = 0;

  for (let month = 1; month <= totalMonths; month++) {
    addBalance += monthlyAddition;

    //Checking whether the capitalization period has begun
    if (month % compoundInterval === 0) {
      const interest = addBalance * compoundRate; //accrued interest
      const tax = interest * (taxRate / 100); //interest tax
      const netInterest = interest - tax; //net interest after tax

      addBalance += netInterest;
      addProfit += netInterest;
    }
  }

  return addProfit;
}

function calcTotalProfit(depositProfit, additionProfit) {
  return round(depositProfit + additionProfit);
}

//Calc Taxes

function calcDepositTax(depositAmount, totalPeriods, compoundRate, taxRate) {
  let depBalance = depositAmount;
  let depTax = 0;

  for (let i = 1; i <= totalPeriods; i++) {
    const interest = depBalance * compoundRate; //accrued interest
    const tax = interest * (taxRate / 100); //interest tax
    const netInterest = interest - tax; //net interest after tax

    depBalance += netInterest;
    depTax += tax;
  }

  return depTax;
}

function calcAdditionTax(
  totalMonths,
  monthlyAddition,
  compoundInterval,
  compoundRate,
  taxRate
) {
  let addBalance = 0;
  let addTax = 0;

  for (let month = 1; month <= totalMonths; month++) {
    addBalance += monthlyAddition;

    if (month % compoundInterval === 0) {
      const interest = addBalance * compoundRate; //accrued interest
      const tax = interest * (taxRate / 100); //interest tax
      const netInterest = interest - tax; //net interest after tax

      addBalance += netInterest;
      addTax += tax;
    }
  }

  return addTax;
}

function calcTotalTaxes(depositTax, additionTax) {
  return round(depositTax + additionTax);
}

//Calc Final Balance after taxes
function calcFinalBalance(totalDepositAmount, totalProfit) {
  return round(totalDepositAmount + totalProfit);
}

function calcRateAfterTaxes(annualRate, taxRate) {
  return annualRate * (1 - taxRate / 100);
}

resetBtn.addEventListener('click', () => {
  // Clear input fields
  document.getElementById('depositAmount').value = 0;
  document.getElementById('interestRate').value = 0;
  document.getElementById('compound').value = 'Monthly';
  document.getElementById('termYears').value = 0;
  document.getElementById('termMonths').value = 0;
  document.getElementById('depositMonthlyAddition').value = 0;
  document.getElementById('taxRate').value = 0;

  // Reset checkboxes
  document.getElementById('addFundsCheckbox').checked = false;
  document.getElementById('calcInclusiveTaxesCheckbox').checked = false;

  // Clear error messages
  document.getElementById('depositAmountError').innerText = '';
  document.getElementById('interestRateError').innerText = '';
  document.getElementById('compoundError').innerText = '';
  document.getElementById('termYearsError').innerText = '';
  document.getElementById('termMonthsError').innerText = '';
  document.getElementById('monthlyAdditionError').innerText = '';
  document.getElementById('taxRateError').innerText = '';

  // Clear results
  document.getElementById('finalBalanceOut').innerText = '';
  document.getElementById('investedOut').innerText = '';
  document.getElementById('interestRateOut').innerText = '';
  document.getElementById('rateAfterTaxesOut').innerText = '';
  document.getElementById('taxesOut').innerText = '';

  console.log('🔄 All fields and results have been reset.');
});
