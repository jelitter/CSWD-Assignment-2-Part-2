let caroussel;

const userComponent = (name, picUrl) => `
    <div style="background-image: url('${picUrl}');
                background-size: cover;
                background-position:center;
                width: 80px;
                height: 80px;
                border-radius: 50%;
                 ">
    </div>
`;

document.addEventListener('DOMContentLoaded', () => {
    console.log(`Document loaded.`);

    caroussel = document.getElementById('caroussel');

    fetch('/assets/pictures.json')
        .then(res => res.json())
        .then(users => {
            console.log(`${users.length} users loaded.`);

            users.splice(10);
            addUsersToCaroussel(users);
        })
        .catch(e => {
            console.error(`Error fetching user info:`, e);
        });
});

const addUsersToCaroussel = users => {
    let userList = document.createElement('ul');

    users.forEach(user => {
        let li = document.createElement('li');

        li.innerHTML = userComponent(user.name, user.picture);

        userList.appendChild(li);
    });

    caroussel.appendChild(userList);
};
