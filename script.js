// Smooth nav behavior
document.querySelectorAll('nav a').forEach(a=>{
  a.addEventListener('click', e=>{
    e.preventDefault();
    const id = a.getAttribute('href').slice(1);
    document.getElementById(id).scrollIntoView({behavior:'smooth'});
  });
});

// Build and animate skill circles
function createSkillSVG(percent) {
  const size = 100;
  const stroke = 12;
  const r = (size / 2) - (stroke / 2);
  const circumference = 2 * Math.PI * r;
  const dash = (percent/100) * circumference;

  return {
    html: `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <circle cx="${size/2}" cy="${size/2}" r="${r}" stroke-width="${stroke}" fill="none" stroke="rgba(255,255,255,0.06)" />
        <circle class="bar" cx="${size/2}" cy="${size/2}" r="${r}" stroke-width="${stroke}" fill="none" stroke="url(#grad)" stroke-linecap="round"
          stroke-dasharray="0 ${circumference}" />
      </svg>
    `,
    circumference,
    dash
  };
}

function animateSkills(){
  document.querySelectorAll('.skill').forEach(skill=>{
    const percent = +skill.dataset.percent || 0;
    const label = skill.dataset.label || skill.getAttribute('data-label') || '';
    const { html, circumference, dash } = createSkillSVG(percent);

    // add a simple gradient inside the svg to match accent
    skill.innerHTML = `
      <svg width="0" height="0" style="position:absolute;opacity:0">
        <defs>
          <linearGradient id="g-${Math.random().toString(36).substr(2,6)}" x1="0%" x2="100%">
            <stop offset="0%" stop-color="#c39bff" stop-opacity="1"/>
            <stop offset="100%" stop-color="#8a4bff" stop-opacity="1"/>
          </linearGradient>
        </defs>
      </svg>
    `;

    // create visible svg with unique gradient id
    const gradId = `g-${Math.random().toString(36).substr(2,8)}`;
    const size = 100;
    const stroke = 12;
    const r = (size/2) - (stroke/2);
    const circ = 2 * Math.PI * r;
    const dashVal = (percent/100)*circ;

    skill.innerHTML += `
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
        <defs>
          <linearGradient id="${gradId}" x1="0%" x2="100%">
            <stop offset="0%" stop-color="#c39bff" stop-opacity="1"/>
            <stop offset="100%" stop-color="#8a4bff" stop-opacity="1"/>
          </linearGradient>
        </defs>
        <circle cx="${size/2}" cy="${size/2}" r="${r}" stroke-width="${stroke}" fill="none" stroke="rgba(255,255,255,0.06)"/>
        <circle class="bar" cx="${size/2}" cy="${size/2}" r="${r}" stroke-width="${stroke}" fill="none" stroke="url(#${gradId})" stroke-linecap="round"
          stroke-dasharray="0 ${circ}" />
      </svg>
    `;

    skill.insertAdjacentHTML('beforeend', `<div class="label">${label}</div>`);
    skill.insertAdjacentHTML('beforeend', `<div class="percent">0%</div>`);

    // animate the stroke dash
    const bar = skill.querySelector('.bar');
    if(bar){
      bar.animate([
        { strokeDasharray: `0 ${circ}` },
        { strokeDasharray: `${dashVal} ${circ}` }
      ], { duration: 1200, easing: 'cubic-bezier(.2,.9,.3,1)', fill: 'forwards' });
    }

    // number count animation
    const percentLabel = skill.querySelector('.percent');
    let cur = 0;
    const step = Math.max(1, Math.floor(percent / 30));
    const t = setInterval(()=>{
      cur += step;
      if(cur >= percent){ cur = percent; clearInterval(t); }
      percentLabel.textContent = cur + '%';
    }, 40);
  });
}

// trigger skills animation once when visible
let skillsAnimated = false;
const skillsEl = document.getElementById('skills');
if(skillsEl){
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting && !skillsAnimated){
        skillsAnimated = true;
        animateSkills();
        obs.disconnect();
      }
    });
  }, { threshold: 0.35 });
  obs.observe(skillsEl);
}

// Contact form handler (demo)
const form = document.getElementById('contactForm');
if(form){
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    alert('Demo: this form does not send messages. Replace with EmailJS or your backend.');
    form.reset();
  });
}

// Avatar parallax
const avatarWrap = document.querySelector('.avatar-wrap');
if(avatarWrap){
  window.addEventListener('mousemove', (ev)=>{
    const rect = avatarWrap.getBoundingClientRect();
    const cx = rect.left + rect.width/2;
    const cy = rect.top + rect.height/2;
    const dx = (ev.clientX - cx)/rect.width;
    const dy = (ev.clientY - cy)/rect.height;
    avatarWrap.style.transform = `rotateX(${dy*10}deg) rotateY(${dx*10}deg)`;
  });
  window.addEventListener('mouseleave', ()=> avatarWrap.style.transform = 'rotateX(0) rotateY(0)');
}
