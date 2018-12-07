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

      currentMember.style.setProperty('border', `solid 1px lightgray`);
      currentMember.style.setProperty('background-color', `white`);

      currentMember.style.setProperty('z-index', `10`);
      currentMember.style.setProperty('box-shadow', `1px 1px 1px rgba(0, 0, 0, 0.25)`);
      //   currentMember.style.setProperty('transform', `scale3d(1.1,1.1,1) rotate3d(0,0,1,${item % 2 === 0 ? -2 : 2}deg)`);
      currentMember.style.setProperty('transform', `scale3d(1.1,1.1,1) rotate3d(0,0,1,${Math.sin(position) * 5}deg)`);

      //   currentMember.style.setProperty('background-image', 'url("/assets/img/favicon.ico")');
      //   currentMember.style.setProperty('background-repeat', 'no-repeat');
      //   currentMember.style.setProperty('background-position', 'top 50% right 4px');

      currentMember.children[0].style.setProperty('opacity', `1`);
      currentMember.children[0].style.setProperty('border-bottom', 'solid 2px var(--main-color)');
      currentMember.children[1].style.setProperty('opacity', `0.9`);
      //   currentMember.children[1].style.setProperty('font-size', '0.9em');
      //   currentMember.children[0].style.setProperty(
      //     'transform',
      //     `scale3d(1.1) rotate3d(0,0,1,${item % 2 === 0 ? -5 : 5}deg)`
      //   );
      currentMember.children[0].style.setProperty('background-color', `transparent`);
      currentMember.children[0].style.setProperty('box-shadow', `none`);
      currentMember.children[0].style.setProperty('border-radius', `0`);

      if (item > 0) {
        const previousMember = memberList.children[item - 1];
        previousMember.style.setProperty('z-index', `1`);
        previousMember.style.setProperty('transform', `scale3d(0.975,0.975,1)`);

        previousMember.children[0].style.setProperty('opacity', '0.5');
        previousMember.children[0].style.setProperty('border-bottom', 'solid 2px gray');
        previousMember.style.setProperty('background-image', 'url("/assets/img/favicon.ico")');
        previousMember.style.setProperty('background-repeat', 'no-repeat');
        previousMember.style.setProperty('background-position', 'center right 4px');
        previousMember.children[1].style.setProperty('opacity', '0.25');
        previousMember.children[1].style.setProperty('color', 'var(--main-color)');
        previousMember.children[1].style.setProperty('transform', `scale3d(0.75,0.75,1)`);
        previousMember.children[0].style.setProperty('transform', `scale3d(1,1,1)`);
        previousMember.children[0].style.setProperty('background-color', `white`);
        // previousMember.children[0].style.setProperty('box-shadow', `1px 2px 3px rgba(0, 0, 0, 0.75)`);
        // previousMember.children[0].style.setProperty('border-radius', `50%`);
      }
    }

    // translate3d performs better then translateX as it uses the GPU
    memberList.style.setProperty('transform', `translate3d(-${position}px,0,0)`);
  }, 16);
};

const addEventListeners = () => {
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
};
