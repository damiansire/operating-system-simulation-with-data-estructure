class Program {
    constructor(icon) {
        this.icon = icon;
    }
}

class ProgramRegister {
    constructor() {
        this.HKEY_CLASSES_ROOT = {};
        this.installProgram(".xls", "https://internetpasoapaso.com/wp-content/uploads/Archivo-extension-XLS.jpg")
        this.installProgram(".txt", "https://img.icons8.com/ios/452/txt.png")
        this.installProgram("", "https://thumbs.dreamstime.com/b/icono-de-la-carpeta-15140345.jpg")

    }
    installProgram(ext, icon) {
        this.HKEY_CLASSES_ROOT[ext] = new Program(icon)
    }
    getProgramIcon(ext) {
        return this.HKEY_CLASSES_ROOT[ext].icon;
    }

}

class WindowsRepository {
    constructor() {
        this.programRegister = new ProgramRegister();
    }
    getElementIcon(ext) {
        return this.programRegister.getProgramIcon(ext);
    }
}

class TreeNode {
    constructor(name, ext = "") {
        this.name = name;
        this.children = [];
        //Conseguir a partir de la extencion el type
        this.type = "conseguirAPartirDeLaExtension";
        this.ext = ext;
    }
    getName() {
        return this.name;
    }
    getExtension() {
        return this.ext;
    }
}

class Tree {
    constructor() {
        this.root = new TreeNode("C:/");
    }
    insertNode(name, node, ext) { //Supongamos me viene "System" /
        let newNode = new TreeNode(name, ext);
        node.children.push(newNode);
    }
    findChildren(name, node) {
        return node.children.find(element => element.name === name);
    }
    getNextNumberValid(name, node) {
        //Mejorar performance
        let usedName = node.children.filter(x => x.name.includes(name)).map(x => x.name.replace(`${name} `, ""));
        let usedNumbers = usedName.reduce((prev, actual) => {
            prev[actual] = true;
            return prev;
        }, {})
        let validNumber = 0;
        let tryNumber = 1;
        while (!validNumber) {
            if (usedNumbers[`(${tryNumber})`]) {
                tryNumber++;
            }
            else {
                validNumber = tryNumber;
            }
        }
        return validNumber;

    }
}

class UIDao {
    constructor() {
        this.fileSystem = new Tree();
        this.selectedNode = this.fileSystem.root;
        this.fileSystem.insertNode("System", this.selectedNode);
        this.fileSystem.insertNode("Archivos de programa", this.selectedNode);
        this.fileSystem.insertNode("Usuarios", this.selectedNode);
        this.fileSystem.insertNode("Windows", this.selectedNode);
        this.fileSystem.insertNode("prueba", this.selectedNode, ".txt");
        this.fileSystem.insertNode("twitch", this.selectedNode, ".txt");
        this.fileSystem.insertNode("mis gastos", this.selectedNode, ".xls");
    }

    getActualNodeFiles() {
        return this.selectedNode.children;
    }

    openFolder(name, ext) {
        let clickedNode = this.selectedNode.children.find(element => element.name === name);
        console.log(clickedNode)
        this.selectedNode = clickedNode;
    }
    createNewFolder() {
        let folderName = "Nueva Carpeta"
        let exist = this.fileSystem.findChildren("Nueva Carpeta", this.selectedNode);
        if (exist) {
            let folderNumber = this.fileSystem.getNextNumberValid("Nueva Carpeta", this.selectedNode);
            folderName = `${folderName} (${folderNumber})`;
        }
        this.fileSystem.insertNode(folderName, this.selectedNode);
    }

}

class UIGenerateHtml {
    static getUiElementHtml(name, ext = "") {
        //Meter esto en una clase global
        let windowsRepository = new WindowsRepository();
        let imgIcon = windowsRepository.getElementIcon(ext);
        return `        
        <div class="fileContainer" data-name="${name}" data-ext="${ext}">
            <div class="fileIconContainer">
                <img class="fileIcon" src="${imgIcon}">
            </div>
            <div class="fileName">
                ${name}
            </div>
        </div>`
    }
    static getUiFolderMessageHtml(message) {
        return `        
        <div>
            <h1>${message}</h1 >
        </div > `
    }
}

class UIDraw {
    constructor() {
        this.fileList = document.getElementById("fileList");
    }
    renderElements(elements) {
        this.cleanScreen();
        if (elements) {
            elements.forEach(elementNode => {
                this.renderElement(elementNode);
            })
        } else {
            this.setMessageInFolder("Carpeta vacia.")
        }
    }
    renderElement(elementNode) {
        let ext = elementNode.getExtension();
        let name = elementNode.getName();
        let html = UIGenerateHtml.getUiElementHtml(name, ext)
        this.fileList.insertAdjacentHTML('beforeend', html);
    }
    setMessageInFolder(message) {
        let html = UIGenerateHtml.getUiFolderMessageHtml(message);
        this.fileList.insertAdjacentHTML('beforeend', html);
    }
    cleanScreen() {
        this.fileList.innerHTML = "";
    }
}

class ContextualMenu {
    constructor() {
        this.initEventListener();
    }
    initEventListener() {
        document.addEventListener('contextmenu', function (e) {
            e.preventDefault();
            const contextualMenu = document.getElementsByClassName("contextual-menu")[0];
            contextualMenu.style.display = "block";
            contextualMenu.style.left = `${e.clientX}px`;
            contextualMenu.style.top = `${e.clientY}px`;
        }, false);
        document.getElementsByClassName("contextual-menu")[0].addEventListener('click', (event) => {
            let action = event.target.getAttribute("button-action");
            if (action === "newFolder") {
                uiController.createNewFolder();
                document.getElementsByClassName("contextual-menu")[0].style.display = "none";
            }
        })
    }
}

class WindowsController {
    constructor() {
        this.contextualMenu = new ContextualMenu();
        this.InitEventListener();
    }
    InitEventListener() {
        document.addEventListener('click', (e) => {
            let elementClick = e.path.find(x => x.className == "fileContainer");
            if (elementClick) {
                let name = elementClick.getAttribute("data-name");
                let ext = elementClick.getAttribute("da ta-ext");
                if (ext) {
                    uiController.openFile(name)
                }
                else {
                    uiController.openFolder(name, ext)
                }
            }
        });
    }
}

class UIController {
    constructor() {
        this.UiDao = new UIDao();
        this.UiDraw = new UIDraw();
        this.WindowsController = new WindowsController();
    }
    renderElements() {
        let fileNode = this.UiDao.getActualNodeFiles();
        this.UiDraw.renderElements(fileNode)
    }
    openFolder(name, ext) {
        this.UiDao.openFolder(name, ext)
        this.UiDraw.renderElements();
    }
    openFile(name) {
        console.log("No implementado");
    }
    createNewFolder() {
        this.UiDao.createNewFolder();
        this.renderElements();
    }

}

let uiController = new UIController();
uiController.renderElements();