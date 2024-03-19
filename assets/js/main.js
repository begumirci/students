const dialogElement = document.querySelector('dialog');
const inputForm = document.querySelector('#studentİnfoForm');

const dialogAc = document.querySelector('#ogrenciEkle');
const allStudent = document.querySelector('#allStudent');

const dialogKapat = document.querySelector('#vazgec');
const class1 = document.querySelector('#sinif1');
const class2 = document.querySelector('#sinif2');
const class3 = document.querySelector('#sinif3');
const class4 = document.querySelector('#sinif4');

const classA = document.querySelector('.classA');
const classB = document.querySelector('.classB');
const classC = document.querySelector('.classC');
const classD = document.querySelector('.classD');

const yazilacakYer = document.querySelector('.burayaYaz');

const options = document.querySelectorAll('[name="genders"]');

const classrooms = [class1, class2, class3, class4];

let students = [];

// Sayfa yüklendiğinde, varsa local storage'dan verileri al
function init() {
  const storedStudents = JSON.parse(localStorage.getItem('students'));
  if (storedStudents) {
    students = storedStudents;
    for (const student of students) {
      addStudent(student);
    }
  }
  sinifMevcutu();
}

dialogAc.addEventListener('click', openDialog);
dialogKapat.addEventListener('click', closeDialog);
inputForm.addEventListener('submit', important);

function openDialog() {
  dialogElement.showModal();
}

function closeDialog() {
  dialogElement.close();
}

function important(e) {
  e.preventDefault();
  const studentData = new FormData(inputForm);
  const studentObj = {};
  for (const [key, value] of studentData.entries()) {
    studentObj[key] = value;
  }
  studentObj.id = crypto.randomUUID();
  studentObj.classroom = Number(studentObj.classroom);
  students.push(studentObj);
  addStudent(studentObj);
  inputForm.reset();

  sinifMevcutu();

  // Verileri local storage'a kaydet
  localStorage.setItem('students', JSON.stringify(students));
}

function addStudent(student) {
  classrooms[student.classroom].appendChild(OgrenciOlustur(student));
  sinifMevcutu();
}

function OgrenciOlustur(student) {
  const studentInform = document.createElement('div');
  studentInform.classList.add('student');

  const deleteBtn = document.createElement('button');
  deleteBtn.innerText = 'Sil';

  studentInform.innerHTML = `<div class= 'ogrenci-konum'>
    <img src="${student.img}" alt="">
    <div class= 'ogrenci-bilgi'>
    <h6 class="unvisible">${student.id}</h6>
    <h6>Ad Soyad: ${student.firstName} ${student.lastName}</h6>
    <h6>Cinsiyet: ${student.gender}</h6>
    <h6>Doğum Tarihi: ${student.birthDate}</h6>
    </div>
    </div>`;

  deleteBtn.classList.add('delBtn');
  deleteBtn.addEventListener('click', deleteStudent);
  studentInform.appendChild(deleteBtn);

  return studentInform;
}

for (const btn of options) {
  btn.addEventListener('click', change);
}

function change() {
  yazilacakYer.classList.value = 'burayaYaz ' + this.value;
  yazilacakYer.innerText = '';
  for (const student of students) {
    if (yazilacakYer.classList.contains('Tümü')) {
      yazilacakYer.innerHTML += `<li>${student.firstName}</li>`;
    } else if (yazilacakYer.classList.contains('Erkek')) {
      if (student.gender === 'Erkek') {
        yazilacakYer.innerHTML += `<li>${student.firstName}</li>`;
      }
    } else if (yazilacakYer.classList.contains('Kadın')) {
      if (student.gender === 'Kadın') {
        yazilacakYer.innerHTML += `<li>${student.firstName}</li>`;
      }
    }
  }
}

function sinifMevcutu() {
  classA.innerText = students.filter(
    (student) => student.classroom === 0
  ).length;
  classB.innerText = students.filter(
    (student) => student.classroom === 1
  ).length;
  classC.innerText = students.filter(
    (student) => student.classroom === 2
  ).length;
  classD.innerText = students.filter(
    (student) => student.classroom === 3
  ).length;
  allStudent.innerText = students.length;
}

// Local storage'dan öğrenci silme
function deleteStudent(e) {
  this.parentElement.remove();
  const studentId =
    e.target.parentElement.querySelector('.unvisible').innerText;
  students = students.filter((student) => student.id !== studentId);

  sinifMevcutu();

  // Güncellenmiş öğrenci listesini local storage'a kaydet
  localStorage.setItem('students', JSON.stringify(students));
}

init();
sinifMevcutu();
