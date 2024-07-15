const getRoot = document.querySelector(".root");

let contacts = [];

// Pulling from backend
fetch(`/contacts.json?cacheBust=${new Date().getTime()}`) // Add cache-busting query parameter
  .then((response) => response.json())
  .then((data) => {
    contacts = data;
    displayContacts(contacts);
  })
  .catch((error) => console.error("Error fetching the contacts data:", error));

function displayContacts(contacts) {
  getRoot.innerHTML = "";

  contacts.forEach((eachContact) => {
    const eachName = eachContact.name;
    const eachNumber = eachContact.phone;

    const newPara = document.createElement("p");
    const name = document.createTextNode(`Name: ${eachName}, Phone: ${eachNumber}`);
    newPara.appendChild(name);
    getRoot.appendChild(newPara);
  });
}

function addContact() {
  contacts.push({ name: "Jack", phone: "012345" });

  displayContacts(contacts);
  updateContactsOnServer(contacts);
}

function deleteContact() {
  contacts.splice(0, 1);
  displayContacts(contacts);
  updateContactsOnServer(contacts);
}

// Function to update contacts on the server
function updateContactsOnServer(updatedContacts) {
  fetch("/update_contacts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedContacts)
  })
    .then(response => response.text())
    .then(data => {
      console.log("Contacts updated:", data);
    })
    .catch(error => console.error("Error updating contacts:", error));
}
