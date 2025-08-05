class sidebar extends HTMLElement{
    constructor(){
        super();
        this.attachShadow({mode: "open"});
    }
    connectedCallback(){
        this.render();
    }
    async render(){
        const data = await this.getHTMLString(); 
        this.shadowRoot.innerHTML = data;

    }
    async getHTMLString(){
    const res = await fetch("./components/sidebar/sidebar.html");
    const data = await res.text();
    return data;
    }
}
customElements.define("my-sidebar", sidebar);