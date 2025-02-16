class body {
  constructor() {
    //style
    document.body.style.backgroundColor = '#f6ece7';
    document.body.style.textAlign = 'center';
    document.body.style.margin = 'auto';
    document.body.style.fontFamily = 'Ubuntu, sans-serif';
    document.body.style.whiteSpace = 'pre-line';

    //elements
    const title = document.createElement('h1');
    title.textContent = '0xZKnw';

    const e1 = document.createElement('p');
    e1.textContent = "Je suis étudiant à l'Université des sciences de Montpellier,\nje suis passionné par l'informatique et notament par la blockchain";

    //appends
    const cont = document.createElement('div');

    cont.style.backgroundColor = '#f9f1ed';
    cont.style.width = '90%';
    cont.style.paddingTop = '1%';
    cont.style.paddingBottom = '20px';
    cont.style.margin = 'auto';
    cont.style.borderRadius = '5px';
    

    cont.appendChild(title);
    cont.appendChild(e1);
    document.body.appendChild(cont);
  }
}

const b = new body();