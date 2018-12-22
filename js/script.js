// const jsonUrl = 'assets/pictures.json';
// ('https://raw.githubusercontent.com/jelitter/CSWD-Assignment-2-Part-2/master/assets/pictures.json?token=AOi0_OdvPRL8aWAlAGyL7win6u26SPvyks5cJASTwA%3D%3D');
const jsonUrl =
  'https://raw.githubusercontent.com/jelitter/CSWD-Assignment-2-Part-2/master/assets/pictures.json?token=AOi0_OdvPRL8aWAlAGyL7win6u26SPvyks5cJASTwA%3D%3D';
const breakPoint = 600;
const memberWidth = 90;
let step = 0.5;
let mobileMode = false;
let windowWidth = 0;
let windowHeight = 0;
let caroussel, interval;
let members, memberList, previousMember;
// let position = 0;

let previousElement;

const memberComponent = (name, picUrl) => `
    <div class="member-picture" style="background-image: url('${picUrl}')"></div>
    <div class="member-name">${name}</div>
`;

const addUsersToCaroussel = members => {
  memberList = document.createElement('ul');

  // Adding one <li> per member to the <ul>
  members.forEach((member, index) => {
    let li = document.createElement('li');
    li.setAttribute('id', 'user_' + index);

    li.innerHTML = memberComponent(member.name, member.picture);
    memberList.appendChild(li);
  });

  caroussel.appendChild(memberList);
};

const animateCaroussel = () => {
  interval = setInterval(() => {
    position += step;
    if (position > members.length * memberWidth) {
      position = 0;
    }

    // const item = Math.floor((position + 3 * memberWidth) / memberWidth);

    // Calculating coordinates of scrolling cards at 2 thirds of the length from left
    const carousselRect = caroussel.getClientRects()[0];
    const x = carousselRect.x + Math.floor((2 * carousselRect.width) / 3);
    const y = carousselRect.y + Math.floor((2 * carousselRect.height) / 3);

    // Determining the element to be animated
    const currentMember = document.elementFromPoint(x, y);
    if (currentMember && currentMember !== previousElement) {
      const elementId = currentMember.getAttribute('id');

      if (elementId && elementId.match(/user_\d+/)) {
        previousElement = currentMember;

        let picture = currentMember.children[0];
        let name = currentMember.children[1];

        if (mobileMode) {
          currentMember.style.setProperty('background-color', `transparent`);
          currentMember.style.setProperty('z-index', `10`);
          currentMember.style.setProperty(
            'transform',
            `scale3d(1.1,1.1,1) rotate3d(0,0,1,${Math.sin(position) * 3}deg)`
          );
          picture.style.setProperty('opacity', `1`);
          picture.style.setProperty('background-color', `transparent`);
          picture.style.setProperty('border-radius', `8px`);
          name.style.setProperty('opacity', `0.9`);
        } else {
          currentMember.style.setProperty('border', `solid 1px lightgray`);
          currentMember.style.setProperty('background-color', `white`);
          currentMember.style.setProperty('z-index', `10`);
          currentMember.style.setProperty('box-shadow', `1px 1px 1px rgba(0, 0, 0, 0.25)`);
          currentMember.style.setProperty(
            'transform',
            `scale3d(1.1,1.1,1) rotate3d(0,0,1,${Math.sin(position) * 3}deg)`
          );
          picture.style.setProperty('opacity', `1`);
          picture.style.setProperty('border-bottom', 'solid 2px var(--main-color)');
          picture.style.setProperty('background-color', `transparent`);
          picture.style.setProperty('box-shadow', `none`);
          picture.style.setProperty('border-radius', `0`);
          name.style.setProperty('opacity', `0.9`);
        }

        if (previousMember && previousMember !== currentMember) {
          picture = previousMember.children[0];
          name = previousMember.children[1];

          if (mobileMode) {
            previousMember.style.setProperty('transform', `scale3d(1,1,1)`);
            picture.style.setProperty('transform', `scale3d(1,1,1)`);
          } else {
            previousMember.style.setProperty('z-index', `1`);
            previousMember.style.setProperty('transform', `scale3d(0.975,0.975,1)`);
            previousMember.style.setProperty('background-image', 'url("./assets/img/favicon.ico")');
            previousMember.style.setProperty('background-repeat', 'no-repeat');
            picture.style.setProperty('opacity', '0.5');
            picture.style.setProperty('border-bottom', 'solid 2px gray');
            picture.style.setProperty('transform', `scale3d(1,1,1)`);
            picture.style.setProperty('background-color', `white`);
            name.style.setProperty('opacity', '0.25');
            name.style.setProperty('color', 'var(--main-color)');
            name.style.setProperty('transform', `scale3d(0.75,0.75,1)`);
          }
        }
        previousMember = currentMember;
      }
    }

    // translate3d performs better than translateX as it uses the GPU
    memberList.style.setProperty('transform', `translate3d(-${position}px,0,0)`);
  }, 16);
};

const addEventListeners = () => {
  // On document loaded
  document.addEventListener('DOMContentLoaded', () => {
    windowResized(window.innerWidth, window.innerHeight);
    caroussel = document.getElementById('caroussel');

    fetch(jsonUrl)
      .then(res => res.json())
      .then(u => {
        members = u;
        console.log(`👥 ${members.length} members loaded.`);

        // Random starting position from the 1st quarter of the list
        position = 2 + Math.floor((Math.random() * members.length) / 4) * memberWidth;

        addUsersToCaroussel(members);
        animateCaroussel();
      })
      .catch(e => {
        console.error(`Error fetching member info:`, e);
      });
    // When mousing over the member list, we stop the animation
    caroussel.addEventListener('mouseover', e => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    });
    // We continue the animation when mousing out the member list
    caroussel.addEventListener('mouseout', e => {
      animateCaroussel();
    });

    // Get dimensions on window resize
    window.addEventListener('resize', event =>
      windowResized(
        (event.srcElement || event.currentTarget).innerWidth,
        (event.srcElement || event.currentTarget).innerHeight
      )
    );
  });
};

const windowResized = (width, height) => {
  windowWidth = width;
  windowHeight = height;
  mobileMode = windowWidth < breakPoint;
  // console.log(`Window resized, dimensions: w:${windowWidth}, h:${windowHeight} - Mobile mode: ${mobileMode}`);
};

addEventListeners();
