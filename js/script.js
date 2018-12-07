let caroussel, interval;
let members, memberList, previousItem;
let position = 0;

const memberComponent = (name, picUrl) => `
    <div class="member-picture" style="background-image: url('${picUrl}')">

    </div>
    <div class="member-name">${name}</div>
`;

document.addEventListener('DOMContentLoaded', () => {
  console.log(`Document loaded.`);

  caroussel = document.getElementById('caroussel');

  caroussel.children;

  fetch('/assets/pictures.json')
    .then(res => res.json())
    .then(u => {
      members = u;
      console.log(`${members.length} members loaded.`);

      // Use this to take just a portion from the 500 members list
      // users.splice(20);

      addUsersToCaroussel(members);
      animateCaroussel();

      addEventListeners();
    })
    .catch(e => {
      console.error(`Error fetching member info:`, e);
    });
});

const addUsersToCaroussel = members => {
  memberList = document.createElement('ul');

  members.forEach(member => {
    let li = document.createElement('li');

    li.innerHTML = memberComponent(member.name, member.picture);

    memberList.appendChild(li);
  });

  caroussel.appendChild(memberList);
  console.log('children', memberList.children);
};

const animateCaroussel = () => {
  memberWidth = 90;
  step = 0.5;

  interval = setInterval(() => {
    position += step;
    if (position > members.length * memberWidth) {
      position = 0;
    }

    const item = Math.floor((position + 3 * memberWidth) / memberWidth);

    if (item != previousItem) {
      previousItem = item;
      const currentMember = memberList.children[item];

      currentMember.children[0].style.setProperty('opacity', `1`);
      currentMember.children[1].style.setProperty('opacity', `1`);
      currentMember.children[0].style.setProperty(
        'transform',
        `scale(1.1) rotate3d(0,0,1,${item % 2 === 0 ? -5 : 5}deg)`
      );
      currentMember.children[0].style.setProperty('background-color', `transparent`);
      currentMember.children[0].style.setProperty('box-shadow', `1px 2px 6px rgba(0, 0, 0, 0.5)`);
      currentMember.children[0].style.setProperty('border-radius', `25%`);

      if (item > 0) {
        const previousMember = memberList.children[item - 1];
        previousMember.children[0].style.setProperty('opacity', '0.5');
        previousMember.children[1].style.setProperty('opacity', '0.25');
        previousMember.children[0].style.setProperty('transform', `scale(1) rotate3d(0,0,1,0deg)`);
        previousMember.children[0].style.setProperty('background-color', `white`);
        previousMember.children[0].style.setProperty('box-shadow', `1px 2px 3px rgba(0, 0, 0, 0.75)`);
        previousMember.children[0].style.setProperty('border-radius', `50%`);
      }
    }

    // translate3d performs better then translateX as it uses the GPU
    memberList.style.setProperty('transform', `translate3d(-${position}px,0,0)`);
  }, 16);
};

const addEventListeners = () => {
  // When mousing over the member list, we stop the animation
  memberList.addEventListener('mouseover', e => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  });
  // We continue the animation when mousing out the member list
  memberList.addEventListener('mouseout', e => {
    animateCaroussel();
  });
};
