// Generate a random password based on specified options
function generatePassword(event) {
    event.stopImmediatePropagation();

    // Retrieve settings from chrome.storage.local
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
            const {
                passwordLength,
                includeSymbols,
                includeNumbers,
                includeLowercase,
                includeUppercase,
                excludeSimilar,
                excludeAmbiguous
            } = data;

            const symbols = "@#$%";
            const numbers = "1234567890";
            const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
            const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            const similarChars = "il1Lo0O";
            const ambiguousChars = "{}\\[\\]()/'\"`~,;:.<>";

            let validChars = "";
            let generatedPassword = "";

            if (includeSymbols) validChars += symbols;
            if (includeNumbers) validChars += numbers;
            if (includeLowercase || (!includeSymbols && !includeNumbers && !includeUppercase && !excludeSimilar && !excludeAmbiguous)) {
                validChars += lowercaseChars; // Default to lowercase characters if nothing else is selected
            }
            if (includeUppercase) validChars += uppercaseChars;

            if (excludeSimilar) {
                // Remove similar characters from validChars
                for (const char of similarChars) {
                    validChars = validChars.replace(new RegExp(char, "g"), "");
                }
            }

            if (excludeAmbiguous) {
                // Remove ambiguous characters from validChars
                const escapedAmbiguousChars = ambiguousChars.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                for (const char of ambiguousChars) {
                    const regex = new RegExp(`[${escapedAmbiguousChars}]`, 'g');
                    validChars = validChars.replace(regex, '');
                }
            }

            const validCharsLength = validChars.length;
            for (let i = 0; i < passwordLength; i++) {
                const randomIndex = Math.floor(Math.random() * validCharsLength);
                generatedPassword += validChars[randomIndex];
            }

            const input = event.target.previousSibling;
            input.type = "text";
            input.value = generatedPassword;
        }
    );
}


// Add a random password button to a password field
function addRandomPasswordButton(field) {
    const button = document.createElement('button');
    button.style = "background-color: #09bbe9;display: inline-block; border:none;border-radius: 16px;box-shadow: 0 0 0 0 rgba(9, 187, 233, .2);margin-left: 4px;";
    button.type = 'button';
    button.addEventListener('click', generatePassword);
    button.addEventListener('tap', generatePassword);
    button.appendChild(document.createTextNode('🔓'));

    field.parentNode.insertBefore(button, field.nextSibling);
}

// Find password fields and add random password buttons
function findPasswordFields() {
    let fields = document.querySelectorAll('[autocomplete="new-password"]');
    if (!fields.length) {
        fields = document.querySelectorAll('[type="password"]');
    }
    if (fields.length) {
        fields.forEach(addRandomPasswordButton);
    }
}

// Run the script when the page loads
(function () {
    findPasswordFields();
})();
