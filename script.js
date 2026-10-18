/**
 * William KH Wang - Modern Portfolio Interactive Logic
 * Features: Background Particle Mesh, Live Wave Simulator, Interactive Terminal,
 * Dark/Light Mode Switcher, Dynamic Typing, Project Filters & Toast System.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTypingEffect();
  initBackgroundCanvas();
  initTerminal();
  initWaveSimulator();
  initProjectFilters();
  initContactSystem();
  initNavigation();
});

/* ==========================================================================
   1. Theme Management (Dark / Light with LocalStorage & OS Preference)
   ========================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

  setTheme(initialTheme);

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

function setTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  
  // Notify background canvas to adjust color if needed
  if (window.updateCanvasTheme) {
    window.updateCanvasTheme(theme);
  }
}

/* ==========================================================================
   2. Dynamic Hero Typing Effect
   ========================================================================== */
function initTypingEffect() {
  const typingEl = document.getElementById('typing-text');
  if (!typingEl) return;

  const titles = [
    'Full-Stack Engineer',
    'AI Agent & Workflow Architect',
    'Interactive Physics & Web Creator',
    'Open Source & System Builder'
  ];

  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 90;

  function type() {
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
      typingEl.textContent = currentTitle.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 40;
    } else {
      typingEl.textContent = currentTitle.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 80;
    }

    if (!isDeleting && charIndex === currentTitle.length) {
      typeSpeed = 1800; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      typeSpeed = 400; // Pause before next word
    }

    setTimeout(type, typeSpeed);
  }

  type();
}

/* ==========================================================================
   3. Interactive Background Particle Mesh Canvas
   ========================================================================== */
function initBackgroundCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 35 : 70;
  const maxDistance = 140;

  let mouse = { x: null, y: null, radius: 150 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 1.5 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse gentle interaction
      if (mouse.x !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }
    }

    draw(theme) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = theme === 'light' ? 'rgba(99, 102, 241, 0.4)' : 'rgba(0, 240, 255, 0.5)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);
    const theme = document.documentElement.getAttribute('data-theme') || 'dark';

    // Draw lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * (theme === 'light' ? 0.15 : 0.2);
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = theme === 'light' ? `rgba(99, 102, 241, ${alpha})` : `rgba(0, 240, 255, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Update and draw particles
    particles.forEach(p => {
      p.update();
      p.draw(theme);
    });

    requestAnimationFrame(animate);
  }

  animate();
}

/* ==========================================================================
   4. Interactive Mini Terminal in Bento Grid
   ========================================================================== */
function initTerminal() {
  const terminalInput = document.getElementById('terminal-input');
  const terminalLogs = document.getElementById('terminal-logs');
  if (!terminalInput || !terminalLogs) return;

  const commands = {
    help: () => [
      'Available commands:',
      '  bio        - Learn more about William',
      '  skills     - View primary technology stack',
      '  projects   - Highlighted repositories & demos',
      '  contact    - Get contact email & social handles',
      '  github     - Open GitHub profile in new tab',
      '  theme      - Toggle between dark/light mode',
      '  clear      - Clear terminal screen',
      '  echo [txt] - Echo back user input'
    ],
    bio: () => [
      'William KH Wang (王國憲)',
      'Software Engineer passionate about high-performance web systems,',
      'autonomous AI agents, interactive physics engines, and clean design.',
      'Always looking for high-impact challenges and collaborative projects.'
    ],
    skills: () => [
      'Frontend:  TypeScript, React, Next.js, Modern CSS, WebGL/Canvas',
      'Backend:   Node.js, Python, FastAPI, Go, PostgreSQL, Redis',
      'AI & Data: Gemini API, LLM Agents, Multi-Agent Workflows, RAG',
      'DevOps:    Docker, Linux, Git, GitHub Actions, Cloudflare'
    ],
    projects: () => [
      '1. WaveSim Lab       - Interactive physics engine & wave simulation',
      '2. AgentFlow Hub     - Autonomous LLM orchestration workflow',
      '3. OmniPulse Cloud   - Distributed real-time system monitoring',
      '4. DevForge CLI      - Cross-platform developer productivity toolkit'
    ],
    contact: () => [
      'Email:    kuohsien2005@gmail.com (Click card to copy)',
      'GitHub:   https://github.com/WilliamKHWang',
      'Status:   🟢 Open for contract, collaboration & full-time roles'
    ],
    github: () => {
      window.open('https://github.com/WilliamKHWang', '_blank');
      return ['Opening https://github.com/WilliamKHWang...'];
    },
    theme: () => {
      const toggle = document.getElementById('theme-toggle');
      if (toggle) toggle.click();
      return ['Theme toggled!'];
    },
    clear: () => {
      terminalLogs.innerHTML = '';
      return [];
    }
  };

  const history = [];
  let historyIndex = -1;

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const inputVal = terminalInput.value.trim();
      terminalInput.value = '';
      if (!inputVal) return;

      history.push(inputVal);
      historyIndex = history.length;

      // Render executed command
      appendLog(`william@portfolio:~$ ${inputVal}`, 'accent');

      const parts = inputVal.split(' ');
      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1).join(' ');

      if (cmd === 'clear') {
        commands.clear();
        return;
      }

      if (cmd === 'echo') {
        appendLog(args || '', 'output');
      } else if (commands[cmd]) {
        const result = commands[cmd]();
        result.forEach(line => appendLog(line, 'output'));
      } else {
        appendLog(`command not found: ${cmd}. Type "help" for a list of commands.`, 'output');
      }

      // Scroll to bottom of terminal
      const terminalBody = terminalLogs.closest('.terminal-body');
      if (terminalBody) {
        terminalBody.scrollTop = terminalBody.scrollHeight;
      }
    } else if (e.key === 'ArrowUp') {
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = history[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < history.length - 1) {
        historyIndex++;
        terminalInput.value = history[historyIndex];
      } else {
        historyIndex = history.length;
        terminalInput.value = '';
      }
    }
  });

  function appendLog(text, className = '') {
    const div = document.createElement('div');
    div.className = `terminal-line ${className}`;
    div.textContent = text;
    terminalLogs.appendChild(div);
  }
}

/* ==========================================================================
   5. Interactive Wave Simulation Lab (Physics Engine Demonstration)
   ========================================================================== */
function initWaveSimulator() {
  const canvas = document.getElementById('wave-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const freqSlider = document.getElementById('wave-freq');
  const ampSlider = document.getElementById('wave-amp');
  const waveTypeSelect = document.getElementById('wave-type');
  const pauseBtn = document.getElementById('wave-pause');

  let width, height;
  let time = 0;
  let isRunning = true;

  function resize() {
    width = canvas.width = canvas.parentElement.clientWidth || 800;
    height = canvas.height = 180;
  }
  window.addEventListener('resize', resize);
  resize();

  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      isRunning = !isRunning;
      pauseBtn.textContent = isRunning ? '暫停模擬' : '繼續模擬';
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    const freq = freqSlider ? parseFloat(freqSlider.value) : 2.5;
    const amp = ampSlider ? parseFloat(ampSlider.value) : 35;
    const type = waveTypeSelect ? waveTypeSelect.value : 'transverse';

    const centerY = height / 2;
    const pointsCount = Math.floor(width / 12);
    const step = width / pointsCount;

    // Draw equilibrium center line
    ctx.beginPath();
    ctx.setLineDash([4, 6]);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();
    ctx.setLineDash([]);

    if (type === 'transverse') {
      // Draw smooth wave curve
      ctx.beginPath();
      ctx.moveTo(0, centerY);

      for (let i = 0; i <= pointsCount; i++) {
        const x = i * step;
        const k = (2 * Math.PI * freq) / width;
        const y = centerY + Math.sin(k * x - time) * amp;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.strokeStyle = '#00f0ff';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Draw particle markers
      for (let i = 0; i <= pointsCount; i += 2) {
        const x = i * step;
        const k = (2 * Math.PI * freq) / width;
        const y = centerY + Math.sin(k * x - time) * amp;

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = i % 4 === 0 ? '#a855f7' : '#ffffff';
        ctx.fill();
      }
    } else {
      // Longitudinal wave (壓縮波 / 疏密波)
      const particleRows = 3;
      for (let r = 0; r < particleRows; r++) {
        const rowY = centerY - 30 + r * 30;

        for (let i = 0; i < pointsCount; i++) {
          const x0 = i * step;
          const k = (2 * Math.PI * freq) / width;
          const displacement = Math.sin(k * x0 - time) * amp * 0.8;
          const actualX = x0 + displacement;

          ctx.beginPath();
          ctx.arc(actualX, rowY, 3.5, 0, Math.PI * 2);
          ctx.fillStyle = '#00f0ff';
          ctx.fill();
        }
      }
    }

    if (isRunning) {
      time += 0.045;
    }
    requestAnimationFrame(render);
  }

  render();
}

/* ==========================================================================
   6. Project Filter Tabs
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category.includes(filter)) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

/* ==========================================================================
   7. Contact System & Copy to Clipboard
   ========================================================================== */
function initContactSystem() {
  const copyBtn = document.getElementById('copy-email-btn');
  const emailText = 'kuohsien2005@gmail.com';

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(emailText).then(() => {
        showToast('📋 電子郵件已複製到剪貼簿！');
        copyBtn.textContent = '已複製！';
        setTimeout(() => {
          copyBtn.textContent = '複製';
        }, 2000);
      }).catch(() => {
        showToast('電子郵件: ' + emailText);
      });
    });
  }

  const form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('contact-name').value;
      showToast(`✨ 感謝 ${name || '訪客'} 的留言！訊息已成功發送。`);
      form.reset();
    });
  }
}

function showToast(message) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = message;
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

/* ==========================================================================
   8. Navigation & Scrollspy
   ========================================================================== */
function initNavigation() {
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // Scrollspy
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset + 120;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });
}
