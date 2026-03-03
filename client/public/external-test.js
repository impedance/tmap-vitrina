alert('EXTERNAL MODULE LOADED');
export const test = () => {
    console.log('Test function executed');
};
document.getElementById('status').innerText = 'EXTERNAL MODULE EXECUTED';
document.body.style.background = 'orange';
