const addBtn = document.querySelector(".add-btn");
const removeBtn = document.querySelector(".close-btn");
const toolBoxColors = document.querySelectorAll(".container1 .color");
const modal = document.querySelector(".modal");
const mainContainer = document.querySelector(".main-cont");
const ticketText = document.querySelector(".text-area input");
const back = document.querySelector(".back");
const modalColors = document.querySelectorAll(".color-area .color");
const colors = ["blue", "green", "yellow", "black"];
let modalPriorityColor = colors[colors.length - 1];
let ticketsArr = JSON.parse(localStorage.getItem("tickets")) || [];

let addFlag = false;
let removeFlag = false;

addBtn.addEventListener("click", () => {
  addFlag = !addFlag;
  if (addFlag) modal.style.display = "flex";
  else modal.style.display = "none";
});

removeBtn.addEventListener("click", (e) => {
  removeFlag = !removeFlag;
  if (removeFlag) removeBtn.style.color = "red";
  else removeBtn.style.color = "black";
});

back.addEventListener("click", () => {
  removeAll();
  ticketsArr.forEach((ticketObj) => {
    createTicket(
      ticketObj.ticket_color,
      ticketObj.ticket_id,
      ticketObj.ticket_info
    );
  });
});
modalColors.forEach((elem) => {
  elem.addEventListener("click", (e) => {
    modalColors.forEach((color) => {
      color.classList.remove("border");
    });
    elem.classList.add("border");
    modalPriorityColor = elem.classList[1];
  });
});

modal.addEventListener("keydown", (e) => {
  if (e.key == "Enter") {
    createTicket(modalPriorityColor, ticketText.value);
    modal.style.display = "none";
    ticketText.value = "";
  }
});

ticketsArr.forEach((elem) => {
  createTicket(elem.ticket_color, elem.ticket_info, elem.ticket_id);
});

for (let i = 0; i < toolBoxColors.length; i++) {
  toolBoxColors[i].addEventListener("click", (e) => {
    let currColor = toolBoxColors[i].classList[1];
    let filterColorWise = ticketsArr.filter((ticketObj) => {
      return currColor === ticketObj.ticket_color;
    });
    removeAll();
    filterColorWise.forEach((ticketObj) => {
      createTicket(
        ticketObj.ticket_color,
        ticketObj.ticket_id,
        ticketObj.ticket_info
      );
    });
  });
}
function removeAll() {
  let allTicketsCont = document.querySelectorAll(".ticket-cont");
  for (let i = 0; i < allTicketsCont.length; i++) {
    allTicketsCont[i].remove();
  }
}

function changeTicketColor(ticket, id) {
  let ticketColor = ticket.querySelector(".ticket-color");
  ticketColor.addEventListener("click", (e) => {
    let ticketIdx = getTicketIdx(id);
    let currentTicketColor = ticketColor.classList[1];
    let currentTicketColorIdx = colors.findIndex((color) => {
      return currentTicketColor === color;
    });
    currentTicketColorIdx++;
    let newTicketColorIdx = currentTicketColorIdx % colors.length;
    let newTicketColor = colors[newTicketColorIdx];
    ticketColor.classList.remove(currentTicketColor);
    ticketColor.classList.add(newTicketColor);

    ticketsArr[ticketIdx].ticket_color = newTicketColor;
    localStorage.setItem("tickets", JSON.stringify(ticketsArr));
  });
}

function getTicketIdx(id) {
  let ticketIdx = ticketsArr.findIndex((ticket) => {
    return ticket.ticket_id === id;
  });
  return ticketIdx;
}

function ToogleLock(ticket, id) {
  const ticketLock = ticket.querySelector(".lock");
  const lock = ticketLock.children[0];
  const ticket_info = ticket.querySelector(".ticket-info");

  lock.addEventListener("click", () => {
    let ticketIdx = getTicketIdx(id);

    if (lock.classList.contains("fa-lock")) {
      lock.classList.remove("fa-lock");
      lock.classList.add("fa-lock-open");
      ticket_info.setAttribute("contenteditable", "true");
      ticket_info.classList.add("highlight");
    } else {
      lock.classList.add("fa-lock");
      lock.classList.remove("fa-lock-open");
      ticket_info.setAttribute("contenteditable", "false");
      ticket_info.classList.add("default");
    }

    ticketsArr[ticketIdx].ticket_info = ticket_info.innerText;
    localStorage.setItem("tickets", JSON.stringify(ticketsArr));
  });
}

function handleRemoval(ticket, id) {
  ticket.addEventListener("click", () => {
    if (!removeFlag) return;
    let ticketIdx = getTicketIdx(id);
    ticketsArr.splice(ticketIdx, 1);
    let strTicketArr = JSON.stringify(ticketsArr);
    localStorage.setItem("tickets", strTicketArr);
    ticket.remove();
  });
}

function createTicket(ticket_color, ticket_info, ticket_id) {
  let id = ticket_id || shortid();
  let ticket_cont = document.createElement("div");
  ticket_cont.setAttribute("class", "ticket-cont");
  ticket_cont.innerHTML += `
    <div class="ticket-color ${ticket_color}"></div>
    <div class="ticket-id">#${id}</div>
    <div class="ticket-info">${ticket_info}</div>
    <div class="lock"><div class=" fa-solid fa-lock"></div></div>`;
  mainContainer.appendChild(ticket_cont);
  if (!ticket_id) {
    ticketsArr.push({ ticket_color, ticket_info, ticket_id: id });
    localStorage.setItem("tickets", JSON.stringify(ticketsArr));
  }

  handleRemoval(ticket_cont, id);
  ToogleLock(ticket_cont, id);
  changeTicketColor(ticket_cont, id);
}
