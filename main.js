import { ele, renderMails, toggleModal } from './scripts/ui.js';
import { getDate } from './scripts/helpers.js';




const strMail = localStorage.getItem('mails') || [];
let mailData = JSON.parse(strMail);


// 1) Navbar için açılma ve kapanma özelliği

ele.menu.addEventListener('click', () => {
    ele.nav.classList.toggle('hide');
});

// 2) Listeleme Özelliği

document.addEventListener('DOMContentLoaded', () => {
    renderMails(mailData);
    if (window.innerWidth < 1200) {
        ele.nav.classList.add('hide');
    }
});

// 3) Modal Açma Kapama

ele.createBtn.addEventListener('click', () => toggleModal(true));
ele.closeBtn.addEventListener('click', () => toggleModal(false));

ele.modal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-wrapper')) {
        toggleModal(false);
    }

});

// 4) Mail Atma Özelliği

ele.modalForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const receiver = e.target[1].value;
    const title = e.target[2].value;
    const message = e.target[3].value;

    if (!receiver || !title || !message) {
        alert('Lütfen Bütün Alanları Doldurun!');
    } else {
        const newMail = {
            id: new Date().getTime(),
            sender: 'Nurullah',
            receiver: receiver,
            title: title,
            message: message,
            date: getDate(),
        };

        mailData.unshift(newMail);


        localStorage.setItem('mails', JSON.stringify(mailData));

        renderMails(mailData);


        toggleModal(false);

    }

});

// 5) Mail Silme Özelliği

const handleClick = (e) => {
    const mail = e.target.closest('.mail');
    const mailId = mail.dataset.id;


    if (e.target.id === 'delete' && confirm('Maili silmek istediğinizden emin misiniz?')) {
        mailData = mailData.filter((mail) => mail.id !== Number(mailId));

        localStorage.setItem('mails', JSON.stringify(mailData));
        mail.remove();
    }

    if (e.target.id === 'star') {
        const found = mailData.find((item) => item.id === Number(mailId));

        found.isStared = !found.isStared;

        localStorage.setItem('mails', JSON.stringify(mailData));

        renderMails(mailData);
    }
};
ele.mailsArea.addEventListener('click', handleClick);

// 6) Navigasyon Menüsü Aktifliği
ele.nav.addEventListener('click', (e) => {

    if (e.target.id === 'cat2') {

        const filtered = mailData.filter((mail) => mail.isStared === true);
        renderMails(filtered);

    } else {
        renderMails(mailData);
    }
});

// 7) Aratma Özelliği

let timer;

ele.searchInp.addEventListener("input", (e) => {
    clearTimeout(timer);
    timer = setTimeout(() => searchMail(e), 400);

});

function searchMail(e) {

    const query = e.target.value;
    const filtered = mailData.filter((mail) =>
        Object.values(mail).slice(1, 6).some((value) => value.toLowerCase().includes(query))
    );


    // mail.title.toLowerCase().includes(query.toLowerCase()));
    if (filtered.length === 0) {
        ele.mailsArea.innerHTML = '<div class="warn">Arattığınız terime uygun mail bulunamadı</div>'
    } else {
        renderMails(filtered);
    }
}