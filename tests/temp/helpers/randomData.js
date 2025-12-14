export function randomEmail(){
    return `User_${Math.random().toString(36).substring(2, 8)}@email.com`;    
}

function randomName() {
    return `User_${Math.random().toString(36).substring(2, 8)}`;
}

export { randomName };

