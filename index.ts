class Portfolio {
  private container: HTMLDivElement;

  constructor() {
    this.applyGlobalStyles();
    this.showSplashScreen();
    this.createContainer();
    this.addHeader();
    this.addAboutSection();
    this.addProjectsSection();
    this.addContactSection();
    document.body.appendChild(this.container);
    this.container.classList.add('startup');
    this.initScrollAnimations();
  }

  private applyGlobalStyles(): void {
    if (!document.head.querySelector("meta[name='viewport']")) {
      const meta = document.createElement('meta');
      meta.name = 'viewport';
      meta.content = 'width=device-width, initial-scale=1.0';
      document.head.appendChild(meta);
    }

    document.body.style.cssText = `
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
      font-size: 16px;
      background: #0a0a0a;
      color: #e2e6ea;
    `;

    const style = document.createElement('style');
    style.textContent = `
      :root {
        --background-color: #0a0a0a; /* Noir profond */
        --text-color: #e2e6ea;
        --container-bg: #181818; /* Conteneur proche du noir */
        --container-border: #333333;
        --container-hover-border: #444444;
        --snippet-bg: #121212;
        --snippet-text: #adbac7;
        --keyword-color: #ff7b72;
        --string-color: #a5d6ff;
        --function-color: #d2a8ff;
      }

      html {
        scroll-behavior: smooth;
        background: var(--background-color);
      }
      body {
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
        font-size: 16px;
        background: var(--background-color);
        color: var(--text-color);
      }

      .ide-container {
        background-color: var(--container-bg);
        padding: 40px 60px 30px;
        border-radius: 6px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        max-width: 1280px;
        width: 80vw;
        overflow: auto;
        margin: 80px auto;
        border: 1px solid var(--container-border);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
        display: flex;
        flex-direction: column;
        position: relative;
      }
      .ide-container:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.4);
        border-color: var(--container-hover-border);
      }
      .ide-header {
        background: var(--container-border);
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0 10px;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        z-index: 10;
      }
      .ide-header div {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        margin-left: 5px;
      }
      .ide-header .close { background-color: #5ac05a; }
      .ide-header .minimize { background-color: #f9c846; }
      .ide-header .maximize { background-color: #ff5c5c; }
      header {
        border-bottom: 1px solid var(--container-border);
        padding-bottom: 10px;
        margin-top: 40px;
      }
      header h1, header h2 {
        color: var(--text-color);
        margin: 0;
      }
      header h2 {
        font-size: 0.85em;
        color: #8b949e;
        margin-top: 5px;
      }
      section {
        margin-bottom: 30px;
      }
      section h3 {
        color: var(--text-color);
        border-bottom: 1px solid var(--container-border);
        padding-bottom: 5px;
        margin-bottom: 15px;
      }
      section p {
        color: #8b949e;
        line-height: 1.5;
      }
      .projects-container {
        display: flex;
        flex-wrap: wrap;
        gap: 40px;
        justify-content: space-around;
        margin-top: 10px;
      }
      .project-card {
        flex: 1 1 40%;
        background-color: var(--container-bg);
        padding: 10px;
        border-radius: 4px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        cursor: pointer;
        position: relative;
        overflow: hidden;
        transition: transform 0.2s ease, box-shadow 0.2s ease, border 0.2s ease;
        border: 1px solid var(--container-border);
      }
      .project-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0,0,0,0.4);
        border-color: var(--container-hover-border);
      }
      .project-card h4 { color: var(--function-color); margin-bottom: 10px; }
      .project-card p { font-size: 0.95em; color: #8b949e; line-height: 1.4; }
      .project-details {
        max-height: 0;
        overflow: hidden;
        opacity: 0;
        transition: max-height 0.5s ease, opacity 0.5s ease;
        font-size: 0.9em;
        margin-top: 10px;
      }
      .project-card.expanded .project-details {
        max-height: 400px;
        opacity: 1;
      }
      .project-details a {
        color: var(--function-color);
        text-decoration: none;
      }
      .project-details a:hover { text-decoration: underline; }
      .code-snippet {
        background: var(--snippet-bg); /* Utilise la couleur définie dans :root, ici #121212 */
        color: #f8f8f2; /* Texte clair */
        border-radius: 4px;
        padding: 10px;
        margin-top: 10px;
        font-family: "JetBrains Mono", Consolas, "Liberation Mono", Menlo, Courier, monospace; // police d'IDE
        font-size: 0.9em;
        overflow-x: auto;
        border: 1px solid var(--container-border);
      }
      .code-snippet .keyword { color: #f92672; }   /* Rouge vif */
      .code-snippet .string { color: #e6db74; }    /* Jaune doux */
      .code-snippet .function { color: #a6e22e; }   /* Vert */
      .code-snippet .comment { color: #75715e; }    /* Gris */
      .scroll-element {
        opacity: 0;
        transform: translateY(20px);
      }
      .animate-appear {
        animation: fadeIn 0.8s ease forwards;
      }
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes startupAnimation {
        0% { opacity: 0; transform: translateY(-20px) scale(0.9); }
        100% { opacity: 1; transform: translateY(0) scale(1); }
      }
      .startup {
        animation: startupAnimation 1s ease-out forwards;
      }
      /* Splash Screen Styles with a slightly enhanced gradient */
      #splash-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(135deg, var(--background-color) 0%, #0d0d0d 100%);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 9999;
      }
      #splash-screen div {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
        font-size: 3em;
        color: var(--text-color);
        font-weight: bold;
      }
      .splash-out {
        animation: splashOut 1s ease forwards;
      }
      @keyframes splashOut {
        0% { opacity: 1; transform: scale(1); }
        100% { opacity: 0; transform: scale(0.9); }
      }
      @media (max-width: 600px) {
        body {
          font-size: 15px;
        }
        .ide-container {
          width: 95vw;
          padding: 20px 30px;
          margin: 20px auto;
          box-sizing: border-box;
        }
        header h1 {
          font-size: 1.5em;
        }
        header h2 {
          font-size: 1em;
        }
        section h3 {
          font-size: 1.2em;
        }
        .project-card { flex: 1 1 100%; }
      }
      /* Animation for social icons on hover */
      .social-icon {
        transition: transform 0.3s ease;
      }
      .social-icon:hover {
        transform: scale(1.2);
      }
    `;
    document.head.appendChild(style);
  }

  private showSplashScreen(): void {
    const splash = document.createElement('div');
    splash.id = 'splash-screen';

    const pseudo = document.createElement('div');
    pseudo.textContent = '0xZKnw';

    splash.appendChild(pseudo);
    document.body.appendChild(splash);

    setTimeout(() => {
      splash.classList.add('splash-out');
      splash.addEventListener('animationend', () => splash.remove());
    }, 2000);
  }

  private createContainer(): void {
    this.container = document.createElement('div');
    this.container.classList.add('ide-container');

    const ideHeader = document.createElement('div');
    ideHeader.classList.add('ide-header');
    ['close', 'minimize', 'maximize'].forEach(type => {
      const circle = document.createElement('div');
      circle.classList.add(type);
      ideHeader.appendChild(circle);
    });
    this.container.appendChild(ideHeader);

    this.container.addEventListener('mouseenter', () => {
      this.container.style.transform = 'scale(1.02)';
    });
    this.container.addEventListener('mouseleave', () => {
      this.container.style.transform = 'scale(1)';
    });
  }

  private addHeader(): void {
    const header = document.createElement('header');
    header.classList.add('scroll-element');

    const title = document.createElement('h1');
    title.textContent = '0xZKnw';

    const subtitle = document.createElement('h2');
    subtitle.textContent = 'Blockchain Developer & Technologist';

    header.append(title, subtitle);
    this.container.appendChild(header);
  }

  private addAboutSection(): void {
    const aboutSection = document.createElement('section');
    aboutSection.classList.add('scroll-element');
    aboutSection.style.textAlign = 'left';

    const heading = document.createElement('h3');
    heading.textContent = 'About me:';

    const paragraph = document.createElement('p');
    paragraph.textContent = "Computer science student passionate about blockchain and cutting–edge technology. I have experience in Python, Java, C, Go, TypeScript, HTML, and CSS.";

    aboutSection.append(heading, paragraph);
    this.container.appendChild(aboutSection);
  }

  private addProjectsSection(): void {
    const projectsSection = document.createElement('section');
    projectsSection.classList.add('scroll-element');
    projectsSection.style.textAlign = 'left';

    const heading = document.createElement('h3');
    heading.textContent = 'My Projects:';

    const projectsContainer = document.createElement('div');
    projectsContainer.classList.add('projects-container');

    const createCard = (
      titleText: string,
      descText: string,
      codeHTML: string,
      detailsHTML: string
    ): HTMLDivElement => {
      const card = document.createElement('div');
      card.classList.add('project-card');

      const title = document.createElement('h4');
      title.textContent = titleText;

      const desc = document.createElement('p');
      desc.textContent = descText;

      const codeSnippet = document.createElement('pre');
      codeSnippet.classList.add('code-snippet');
      codeSnippet.innerHTML = codeHTML;

      const details = document.createElement('div');
      details.classList.add('project-details');
      details.innerHTML = detailsHTML;

      card.append(title, desc, codeSnippet, details);
      card.addEventListener('click', () => card.classList.toggle('expanded'));

      return card;
    };

    const Nexa = createCard(
      'Nexa',
      'Decentralized messaging service on blockchain.',
      `<span class='keyword'>from</span> <span class='function'>Nexa</span> <span class='keyword'>import</span> <span class='function'>initService</span>
messaging = <span class='function'>initService</span>(<span class='string'>'Nexa'</span>)`,
      "Developed with a team in Python. GitHub: <a href='https://github.com/val-005/Nexa'>Nexa</a>"
    );

    const BC_Test = createCard(
      'Test Blockchain in Python',
      'Creating a simple blockchain.',
      `<span class='keyword'>def</span> <span class='function'>create_blockchain</span>():
    <span class='keyword'>return</span> [<span class='string'>'genesis block'</span>]`,
      "Developed solo in Python. GitHub: <a href='https://github.com/0xZKnw/Bc_Test'>Bc_Test</a>"
    );

    const ZKnwMe = createCard(
      '0xZKnw.me',
      'This Website with blockchain integrations.',
      `<span class='keyword'>import</span> axios;
axios.<span class='function'>get</span>(<span class='string'>'https://0xZKnw.me'</span>);`,
      "Developed solo in TypeScript. GitHub: <a href='https://github.com/0xZKnw/0xzknw.me'>0xZKnw.me</a>"
    );

    const PwdMng = createCard(
      'PwdMng',
      'A password manager with secure blockchain storage.',
      `<span class='keyword'>import</span> cryptography
<span class='keyword'>def</span> <span class='function'>encrypt_password</span>(password):
    <span class='keyword'>return</span> cryptography.<span class='function'>encrypt</span>(password)`,
      'Developed solo in Python. GitHub: <a href="https://github.com/0xZKnw/PwdMng">PwdMng</a>'
    );

    projectsContainer.append(Nexa, PwdMng, ZKnwMe, BC_Test);
    projectsSection.append(heading, projectsContainer);
    this.container.appendChild(projectsSection);
  }

  private addContactSection(): void {
    const contactSection = document.createElement('section');
    contactSection.classList.add('scroll-element');
    contactSection.style.textAlign = 'center';

    const heading = document.createElement('h3');
    heading.textContent = 'Contact';

    const iconsContainer = document.createElement('div');
    iconsContainer.style.display = 'flex';
    iconsContainer.style.justifyContent = 'center';
    iconsContainer.style.gap = '20px';
    iconsContainer.style.marginTop = '10px';

    const createIconLink = (href: string, imgSrc: string, altText: string): HTMLAnchorElement => {
      const link = document.createElement('a');
      link.href = href;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      const img = document.createElement('img');
      img.src = imgSrc;
      img.alt = altText;
      img.style.width = '32px';
      img.style.height = '32px';
      img.classList.add('social-icon');

      link.appendChild(img);
      return link;
    };

    const discordIcon = createIconLink('https://discord.com/users/0xZKnw', './img/discord.svg', 'Discord');
    const githubIcon = createIconLink('https://github.com/0xZKnw', './img/github.svg', 'GitHub');
    const twitterIcon = createIconLink('https://twitter.com/0xZKnw', './img/x.svg', 'Twitter');
    const linkedinIcon = createIconLink('https://www.linkedin.com/in/justin-olivier-1a6b0a31a/', './img/linkedin.svg', 'LinkedIn');

    iconsContainer.append(discordIcon, githubIcon, twitterIcon, linkedinIcon);
    contactSection.append(heading, iconsContainer);
    this.container.appendChild(contactSection);
  }

  private initScrollAnimations(): void {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-appear');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.scroll-element').forEach(element => {
      observer.observe(element);
    });
  }
}

new Portfolio();
