const addFundsCheckbox = document.getElementById('addFundsCheckbox');
const addFunds = document.getElementById('addFunds');

//Open the field for entering the deposit monthly addition
addFundsCheckbox.addEventListener('change', () => {
  if (addFundsCheckbox.checked) {
    addFunds.classList.add('is-open');
  } else {
    addFunds.classList.remove('is-open');
  }
});

const calcInclusiveTaxesCheckbox = document.getElementById(
  'calcInclusiveTaxesCheckbox'
);
const calcInclusiveTaxes = document.getElementById('calcInclusiveTaxes');

//Open the field for entering the tax rate
calcInclusiveTaxesCheckbox.addEventListener('change', () => {
  if (calcInclusiveTaxesCheckbox.checked) {
    calcInclusiveTaxes.classList.add('is-open');
  } else {
    calcInclusiveTaxes.classList.remove('is-open');
  }
});
