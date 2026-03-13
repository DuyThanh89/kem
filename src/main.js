import './style.css'

let questions = []

function generateQuestions() {
  const container = document.getElementById("questions")
  if (!container) return;

  container.innerHTML = ""
  questions = []

  const clearWrongBtn = document.getElementById("clear-wrong-btn")
  if (clearWrongBtn) clearWrongBtn.classList.add('hidden')
  
  const resultEl = document.getElementById("result")
  if (resultEl) resultEl.innerHTML = ""

  const formatNum = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  for (let i = 0; i < 12; i++) {
    let a = Math.floor(Math.random() * 90000) + 10000
    let b = Math.floor(Math.random() * 90000) + 10000

    questions.push({
      a: a,
      b: b,
      answer: a + b
    })

    const card = document.createElement("div")
    card.className = "bg-white border border-slate-200 rounded-3xl p-6 relative shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"

    card.innerHTML = `
      <div class="absolute top-4 left-4 bg-blue-50 text-blue-600 w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold">${i + 1}</div>
      <div class="math-content">
        <div class="block">${formatNum(a)}</div>
        <div class="bottom-num">
          <span class="text-slate-400 font-normal">+</span>
          ${formatNum(b)}
        </div>
      </div>
      <input type="number" 
             class="w-full box-border bg-slate-100 border-none rounded-xl p-3.5 text-xl text-center focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all" 
             id="q${i}" 
             placeholder=""
             autocomplete="off">
    `

    container.appendChild(card)
  }
}

function checkInputs() {
  const completeBtn = document.getElementById("complete-btn")
  if (!completeBtn) return

  let allFilled = true
  for (let i = 0; i < 12; i++) {
    const val = document.getElementById("q" + i).value
    if (val === "") {
      allFilled = false
      break
    }
  }

  if (allFilled) {
    completeBtn.disabled = false
    completeBtn.classList.remove('opacity-50', 'cursor-not-allowed')
  } else {
    completeBtn.disabled = true
    completeBtn.classList.add('opacity-50', 'cursor-not-allowed')
  }
}

function checkAnswers() {
  let score = 0

  questions.forEach((q, index) => {
    const inputEl = document.getElementById("q" + index)
    const val = inputEl.value

    if (Number(val) === q.answer) {
      score++
      inputEl.classList.remove('focus:ring-blue-500', 'focus:ring-red-500')
      inputEl.classList.add('ring-2', 'ring-emerald-500')
    } else {
      inputEl.classList.remove('focus:ring-blue-500', 'focus:ring-emerald-500')
      inputEl.classList.add('ring-2', 'ring-red-500')
    }
  })

  const resultEl = document.getElementById("result")
  if (resultEl) {
    resultEl.innerHTML = `Kết quả: ${score} / 12`
    
    if (score === 12) {
      resultEl.className = "mt-8 text-center text-2xl font-bold text-emerald-600"
      resultEl.innerHTML += " - Tuyệt vời! 🎉"
    } else if (score >= 6) {
      resultEl.className = "mt-8 text-center text-2xl font-bold text-amber-600"
    } else {
      resultEl.className = "mt-8 text-center text-2xl font-bold text-red-600"
    }

    resultEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const clearWrongBtn = document.getElementById("clear-wrong-btn")
  if (clearWrongBtn) {
    if (score < 12) {
      clearWrongBtn.classList.remove('hidden')
    } else {
      clearWrongBtn.classList.add('hidden')
    }
  }
}

function clearWrongAnswers() {
  questions.forEach((q, index) => {
    const inputEl = document.getElementById("q" + index)
    if (Number(inputEl.value) !== q.answer) {
      inputEl.value = ""
      inputEl.classList.remove('ring-2', 'ring-red-500', 'ring-emerald-500')
      inputEl.classList.add('focus:ring-blue-500')
    }
  })

  // Hide the result message and ourselves
  const resultEl = document.getElementById("result")
  if (resultEl) resultEl.innerHTML = ""
  
  const clearWrongBtn = document.getElementById("clear-wrong-btn")
  if (clearWrongBtn) clearWrongBtn.classList.add('hidden')

  checkInputs()
}

document.addEventListener('DOMContentLoaded', () => {
  generateQuestions()

  const container = document.getElementById("questions")
  if (container) {
    container.addEventListener('input', checkInputs)
  }

  const completeBtn = document.getElementById("complete-btn")
  if (completeBtn) {
    completeBtn.addEventListener('click', checkAnswers)
    checkInputs() // Initial check
  }

  const clearWrongBtn = document.getElementById("clear-wrong-btn")
  if (clearWrongBtn) {
    clearWrongBtn.addEventListener('click', clearWrongAnswers)
  }

  const newGameBtn = document.getElementById("new-game-btn")
  if (newGameBtn) {
    newGameBtn.addEventListener('click', () => {
      generateQuestions()
      checkInputs()
    })
  }
})
