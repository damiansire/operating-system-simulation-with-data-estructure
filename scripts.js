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
        this.root = new TreeNode("/");
    }
    insertNodeByPath(name, path, ext) { //Supongamos me viene "System" /
        let newNode = new TreeNode(name, ext);
        this.root.children.push(newNode);
    }
}

class UIDao {
    constructor() {
        this.fileSystem = new Tree();
        this.fileSystem.insertNodeByPath("System", "/");
        this.fileSystem.insertNodeByPath("Archivos de programa", "/");
        this.fileSystem.insertNodeByPath("Usuarios", "/");
        this.fileSystem.insertNodeByPath("Windows", "/");
        this.fileSystem.insertNodeByPath("prueba", "/", ".txt");
        this.fileSystem.insertNodeByPath("twitch", "/", ".txt");
        this.fileSystem.insertNodeByPath("mis gastos", "/", ".xls");
        this.selectedNode = this.fileSystem.root;
    }
    txt

    getActualNodeFiles() {
        return this.selectedNode.children;
    }

    openFolder(name, ext) {
        console.log("Abriendo la carpeta ", name, " ", ext)
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
}

class UIDraw {
    constructor() {
        this.fileList = document.getElementById("fileList");
    }

    renderElements(elements) {
        elements.forEach(elementNode => {
            this.renderElement(elementNode);
        })
    }

    renderElement(elementNode) {
        let ext = elementNode.getExtension();
        let name = elementNode.getName();
        let html = UIGenerateHtml.getUiElementHtml(name, ext)
        this.fileList.insertAdjacentHTML('beforeend', html);
    }
}

class FolderController {
    constructor() {
        this.InitEventListener();
    }
    InitEventListener() {
        document.addEventListener('click', (e) => {
            let elementClick = e.path.find(x => x.className == "fileContainer");
            if (elementClick) {
                let name = elementClick.getAttribute("data-name");
                let ext = elementClick.getAttribute("data-ext");
                if (ext) {
                    uiController.openFile(name)
                }
                else {
                    uiController.openFolder(name, ext)
                }
            }
        })
    }
}


class UIController {
    constructor() {
        this.UiDao = new UIDao();
        this.UiDraw = new UIDraw();
        this.FolderController = new FolderController();
    }
    renderElements() {
        let fileNode = this.UiDao.getActualNodeFiles();
        this.UiDraw.renderElements(fileNode)
    }
    openFolder(name, ext) {
        this.UiDao.openFolder(name, ext)
    }
    openFile(name) {
        console.log("No implementado");
    }

}


let uiController = new UIController();
uiController.renderElements();