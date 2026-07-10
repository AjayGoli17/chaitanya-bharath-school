#!/usr/bin/env python3
import re, os

FILE = "index.html"
with open(FILE, "r", encoding="utf-8") as f:
    html = f.read()
original = html

style_pattern = re.compile(
    r"[ \t]*<!-- Page loading animation -->\s*\n[ \t]*<style>.*?#pageLoader.*?</style>\s*\n",
    re.DOTALL
)
new_head_snippet = '    <!-- Page loading animation -->\n    <link rel="stylesheet" href="css/loader.css">\n'
html, n1 = style_pattern.subn(new_head_snippet, html)

div_pattern = re.compile(
    r'<div id="pageLoader">\s*\n\s*<img src="logo1\.png" alt="CBS Logo">\s*\n\s*<div class="track"><div class="bar"></div></div>\s*\n\s*</div>'
)
new_div = ('<div class="loader" id="pageLoader">\n'
           '        <img src="logo1.jpg" alt="CBS Logo">\n'
           '        <div class="track"><div class="bar"></div></div>\n'
           '    </div>')
html, n2 = div_pattern.subn(new_div, html)

script_pattern = re.compile(
    r"[ \t]*<script>\s*\n\s*window\.addEventListener\('load'.*?</script>\s*\n",
    re.DOTALL
)
new_script_snippet = '    <!-- Page loading animation -->\n    <script src="js/loader.js"></script>\n'
html, n3 = script_pattern.subn(new_script_snippet, html)

if html == original:
    print("No changes made - markers not found.")
else:
    with open(FILE, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Done. style:{n1} div:{n2} script:{n3}")

os.makedirs("css", exist_ok=True)
os.makedirs("js", exist_ok=True)

with open("css/loader.css", "w", encoding="utf-8") as f:
    f.write('''/* CBS Page Loading Animation */
:root{ --loader-navy:#1f2f6e; }
body.is-loading{ overflow:hidden; }
.loader{
  position:fixed; inset:0; z-index:9999; height:100vh;
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  background:#ffffff; transition:opacity 0.5s ease, visibility 0.5s ease;
}
.loader img{ width:110px; }
.loader .track{
  width:220px; height:6px; background:#eef0f8;
  border-radius:6px; overflow:hidden; margin-top:22px;
}
.loader .bar{
  height:100%; width:0%; border-radius:6px;
  background:var(--loader-navy);
  animation: barFill 2.2s ease-in-out infinite;
}
@keyframes barFill{ 0%{ width:0%; } 90%{ width:100%; } 100%{ width:100%; } }
.loader.loader-hidden{ opacity:0; visibility:hidden; pointer-events:none; }
''')

with open("js/loader.js", "w", encoding="utf-8") as f:
    f.write('''window.addEventListener('load', function () {
  var loader = document.getElementById('pageLoader');
  document.body.classList.remove('is-loading');
  if (loader) {
    loader.classList.add('loader-hidden');
    loader.addEventListener('transitionend', function () {
      loader.remove();
    }, { once: true });
  }
});
''')
print("Wrote css/loader.css and js/loader.js")
