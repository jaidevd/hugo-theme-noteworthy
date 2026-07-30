window.onload = wrapTable();

// nav.html (rendered before #content) and footer-mobile.html (rendered
// after) both include this script, so whichever copy runs first must wait
// for the full page to load before it can find the post content.
window.addEventListener('load', convertFootnotesToSidenotes);

// Wrap tables in a div so that they scroll responsively.
function wrapTable() {
    const tables = document.querySelectorAll('table');
    tables.forEach((table) => {
      const tableWrapper = document.createElement('div');
      tableWrapper.className = 'table-wrapper';
      table.parentElement.replaceChild(tableWrapper, table);
      tableWrapper.appendChild(table);
    });
  };

// Duplicate each footnote's content into a sidenote next to its reference.
// The original footnote list is left untouched: CSS decides, per viewport
// width, whether the sidenotes or the footnote list at the bottom are shown.
function convertFootnotesToSidenotes() {
    if (window.__sidenotesInitialized) return;
    window.__sidenotesInitialized = true;

    document.querySelectorAll('sup[id^="fnref"]').forEach((sup) => {
      const link = sup.querySelector('a.footnote-ref');
      if (!link) return;

      // getElementById (not querySelector) because footnote ids contain a
      // colon (e.g. "fn:1"), which querySelector would parse as a pseudo-class.
      const footnote = document.getElementById(link.getAttribute('href').slice(1));
      if (!footnote) return;

      const clone = footnote.cloneNode(true);
      clone.querySelectorAll('a.footnote-backref').forEach((backref) => backref.remove());

      const sidenote = document.createElement('span');
      sidenote.className = 'sidenote';

      const number = document.createElement('span');
      number.className = 'sidenote-number';
      number.textContent = link.textContent;
      sidenote.appendChild(number);

      sidenote.insertAdjacentHTML('beforeend', clone.innerHTML);
      sup.insertAdjacentElement('afterend', sidenote);
    });
  };

