// Function to generate the options for password length select element
function generatePasswordLengthOptions() {
    const selectElement = document.getElementById("passwordLength");
    if (selectElement) {
        const maxLength = 128;
        for (let i = 8; i <= maxLength; i++) {
            const optionElement = document.createElement("option");
            optionElement.value = i;
            optionElement.textContent = i;
            selectElement.appendChild(optionElement);
        }
    }
}

// Function to load settings from chrome.storage and update the UI
function loadSettings() {
    chrome.storage.local.get(
        {
            passwordLength: 16,
            includeSymbols: true,
            includeNumbers: true,
            includeLowercase: true,
            includeUppercase: true,
            excludeSimilar: false,
            excludeAmbiguous: false
        },
        (data) => {
            document.getElementById("passwordLength").value = data.passwordLength;
            document.getElementById("includeSymbols").checked = data.includeSymbols;
            document.getElementById("includeNumbers").checked = data.includeNumbers;
            document.getElementById("includeLowercase").checked = data.includeLowercase;
            document.getElementById("includeUppercase").checked = data.includeUppercase;
            document.getElementById("excludeSimilar").checked = data.excludeSimilar;
            document.getElementById("excludeAmbiguous").checked = data.excludeAmbiguous;
        }
    );
}

// Function to save settings to chrome.storage when options are changed
function saveSettings() {
    const passwordLength = document.getElementById("passwordLength").value;
    const includeSymbols = document.getElementById("includeSymbols").checked;
    const includeNumbers = document.getElementById("includeNumbers").checked;
    const includeLowercase = document.getElementById("includeLowercase").checked;
    const includeUppercase = document.getElementById("includeUppercase").checked;
    const excludeSimilar = document.getElementById("excludeSimilar").checked;
    const excludeAmbiguous = document.getElementById("excludeAmbiguous").checked;

    chrome.storage.local.set({
        passwordLength: parseInt(passwordLength),
        includeSymbols,
        includeNumbers,
        includeLowercase,
        includeUppercase,
        excludeSimilar,
        excludeAmbiguous
    });
}

// Add event listeners to update settings and save when options are changed
function setupEventListeners() {
    document.getElementById("passwordLength").addEventListener("change", saveSettings);
    document.getElementById("includeSymbols").addEventListener("change", saveSettings);
    document.getElementById("includeNumbers").addEventListener("change", saveSettings);
    document.getElementById("includeLowercase").addEventListener("change", saveSettings);
    document.getElementById("includeUppercase").addEventListener("change", saveSettings);
    document.getElementById("excludeSimilar").addEventListener("change", saveSettings);
    document.getElementById("excludeAmbiguous").addEventListener("change", saveSettings);
}

// Load settings and setup event listeners on window load
window.addEventListener("DOMContentLoaded", () => {
    generatePasswordLengthOptions();
    loadSettings();
    setupEventListeners();
});
