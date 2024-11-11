// Get modal element
var modal = document.getElementById("cityModal");
// Get the span element that closes the modal
var span = document.getElementsByClassName("close")[0];
// Get the test title element in the modal
var testTitle = document.getElementById("testTitle");

// Function to show the modal and set the test name
function showCityPopup(testName) {
    modal.style.display = "flex"; // Show modal by changing display to 'flex'
    testTitle.textContent = testName; // Set the test title in the modal
}

// Function to close the modal
function closeModal() {
    modal.style.display = "none"; // Hide modal by changing display to 'none'
}

// Event listener for closing the modal when the user clicks outside of it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Event listener for closing the modal when the 'x' is clicked
span.onclick = function() {
    closeModal();
}

// Optional: Redirect function for booking (not implemented)
function redirectToBooking() {
    alert("Redirecting to booking page..."); // Example action
    // Add your booking redirection logic here
}
