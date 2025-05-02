(() => {
    //grammar rules: maps rule number → [LHS, RHS array]
    const rules = {
      1: ['E', ['E','+','T']],
      2: ['E', ['T']],
      3: ['T', ['T','*','F']],
      4: ['T', ['F']],
      5: ['F', ['(','E',')']],
      6: ['F', ['id']]
    };
  
    // table: action/rule
    const table = {
      0: { id:{a:'s',to:5}, '(':{a:'s',to:4}, E:1, T:2, F:3 },
      1: { '+':{a:'s',to:6}, '$':{a:'acc'} },
      2: { '+':{a:'r',to:2}, '*':{a:'s',to:7}, ')':{a:'r',to:2}, '$':{a:'r',to:2} },
      3: { '+':{a:'r',to:4}, '*':{a:'r',to:4}, ')':{a:'r',to:4}, '$':{a:'r',to:4} },
      4: { id:{a:'s',to:5}, '(':{a:'s',to:4}, E:8, T:2, F:3 },
      5: { '+':{a:'r',to:6}, '*':{a:'r',to:6}, ')':{a:'r',to:6}, '$':{a:'r',to:6} },
      6: { id:{a:'s',to:5}, '(':{a:'s',to:4}, T:9, F:3 },
      7: { id:{a:'s',to:5}, '(':{a:'s',to:4}, F:10 },
      8: { '+':{a:'s',to:6}, ')':{a:'s',to:11} },
      9: { '+':{a:'r',to:1}, '*':{a:'s',to:7}, ')':{a:'r',to:1}, '$':{a:'r',to:1} },
     10: { '+':{a:'r',to:3}, '*':{a:'r',to:3}, ')':{a:'r',to:3}, '$':{a:'r',to:3} },
     11: { '+':{a:'r',to:5}, '*':{a:'r',to:5}, ')':{a:'r',to:5}, '$':{a:'r',to:5} }
    };
  // dom refereneces to store logic
    const exprInput = document.getElementById('expression');
    const outputBody = document.querySelector('#output tbody'); //append
    const btnStep = document.getElementById('step');
    const btnRun = document.getElementById('run');
    const btnReset = document.getElementById('reset');
  
    let stack, input, done;
    function init(){
      const rawInput = exprInput.value.trim();
      if (!rawInput) {
        alert('Please enter an expression');
        return false;
      }
  
      const tokens = rawInput
      .replace(/([\(\)\+\*\$])/g, ' $1 ')
      .trim()
      .split(/\s+/);
  
      if (tokens.pop() !== '$') {
        alert('Expression must end with $');
        return false;
      }
        if (!tokens.every(t => /^id$|^[+*()$]$/.test(t))) {
          alert ('Invalid token detected');
          return false;
        }
        // parser default setting
        stack = [0];
        input = tokens.concat('$'); //end
        done = false;
  
      outputBody.textContent = '';
      appendRow('Start');
      btnStep.disabled = btnRun.disabled = false;
      return true;
      }
  
  
      function appendRow(action) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
      <td>${stack.join(' ')}</td>
      <td>${input.join(' ')}</td>
      <td>${action}</td>
      `;
      outputBody.appendChild(tr);
      }
  
      function step (){
        if (stack == null) {
          if (!init()) return;
        }
        if (done) return;
  
        const s = stack[stack.length - 1]; //state
        const a = input[0]; //next
        const e = table[s]?.[a];
  
        if (!e){
          alert('Syntax error: Unexpected token');
          done = true;
          return;
        }
        if (e.a === 's'){
          stack.push(input.shift(), e.to);
          appendRow(`S${e.to}`);
        }
        else if (e.a == 'r'){
          const [lhs, rhs] = rules[e.to];
          stack.length -= rhs.length * 2;
          const ns = stack[stack.length - 1];
         stack.push(lhs, table[ns][lhs]);
         appendRow(`R${e.to}`);
        }
          else {
            appendRow('acc');
            alert('Accepted');
            done = true;
            btnStep.disabled = btnRun.disabled = true;
          }
        }
        function runAll() {
          if (stack == null && !init()) return;
          while (!done) step();
        }
        function reset() {
          exprInput.value = '';
          outputBody.textContent = '';
          stack = input = undefined;
          done = false;
          btnStep.disabled = btnRun.disabled = false;
        }
      btnStep .addEventListener('click', step);
      btnRun  .addEventListener('click', runAll);
      btnReset.addEventListener('click', reset);
      window.addEventListener('DOMContentLoaded', reset);
  
      })();
  
  
  