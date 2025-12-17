let allnodes = [];
let originalOrder = [];

async function loadNodes() {
    try {
        const response = await fetch('products.json');
        allnodes = await response.json();
        originalOrder = [...allnodes];
        
        displayNodes(allnodes);
            
    } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        return false
    }
}

function displayNodes(nodes) {
    const containers = document.getElementsByClassName('parsedNodes');
    
    if (containers.length === 0) {
        return;
    }
    
    const container = document.querySelector('.parsedNodes');
    
    container.innerHTML = nodes.map(node => `
        <div class="node">
            <div class="nodeHeader">
                <div class="nodeImageContainer">
                ${node.imagePath ? `<img src="${node.imagePath}" class="nodeImage">` : ''} 
                <div class="nodeImageOverlay">
                    <p class="nodeOverlay">${node.overlay}</p>
                    <p class="nodeOverlayDescription">${node.overlayDescription}</p>
                </div>
                </div>
                <div class="nodeHeaderText">
                    <p class="nodeHeaderTextBrand">${node.brand}</p>
                    <p>${node.description}</p>
                </div>
            </div>
            <div class="nodePrice">${node.price || 'Нет в наличии'}</div>
        </div>
    `).join('');
}

document.addEventListener('click', async function(event) {
    const clickedElem = event.target
    const nodes = document.getElementsByClassName('node')
    const welcome = document.getElementById('welcomeHeader')
    if (clickedElem.matches('button')) {
        if (nodes.length > 0) {
            if (clickedElem.textContent == 'Удалить данные парсинга') {
                Array.from(nodes).forEach(element => {
                    element.remove()
                });
                welcome.textContent = 'Удалено.'
            }
            else {
                loadNodes() 
                welcome.textContent = 'Успех!'}
        } else {
            if (clickedElem.textContent == 'Удалить данные парсинга') {
                welcome.textContent = 'Нечего удалять!'
            }
            else {
                const result = await loadNodes()
                if (result == false) {
                    welcome.textContent = 'Нечего парсить!'
                } else {
                    welcome.textContent = 'Успех!'
                }
            }
        }
    }
})