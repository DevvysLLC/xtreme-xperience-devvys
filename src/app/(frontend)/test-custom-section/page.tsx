'use client'

import { SectionCustomHtml } from '../../../components/section-custom-html'

export default function TestCustomSectionPage() {
  const testData = {
    id: 'test-custom-section',
    title: 'Custom Code Section Test Page',
    subtitle: 'This page verifies that Custom HTML, CSS, and JS execute successfully.',
    html: `
      <div class="custom-card">
        <h3>Interactive Demo</h3>
        <p>Click the button below to trigger the custom JavaScript action.</p>
        <button id="test-btn" class="custom-btn">Click Me!</button>
        <p id="test-result" class="custom-result"></p>
      </div>
    `,
    css: `
      .custom-card {
        background: linear-gradient(135deg, #1e1e3f 0%, #2b2b5c 100%);
        border: 2px solid #5d5dff;
        border-radius: 12px;
        padding: 2rem;
        color: #ffffff;
        text-align: center;
        max-width: 500px;
        margin: 2rem auto;
        box-shadow: 0 8px 32px rgba(93, 93, 255, 0.2);
      }
      .custom-btn {
        background: #5d5dff;
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        font-weight: bold;
        border-radius: 6px;
        cursor: pointer;
        transition: transform 0.2s, background 0.2s;
        margin-top: 1rem;
      }
      .custom-btn:hover {
        background: #7d7dff;
        transform: scale(1.05);
      }
      .custom-result {
        margin-top: 1rem;
        font-weight: bold;
        color: #00ffcc;
        min-height: 1.5rem;
      }
    `,
    js: `
      const btn = document.getElementById('test-btn');
      const result = document.getElementById('test-result');
      if (btn && result) {
        btn.addEventListener('click', () => {
          result.textContent = '🎉 Custom JS Executed Successfully!';
          btn.style.background = '#00ffcc';
          btn.style.color = '#1e1e3f';
        });
      }
    `
  }

  return (
    <main style={{ padding: '4rem 2rem', minHeight: '100vh', background: '#0b0b1a' }}>
      <SectionCustomHtml data={testData} />
    </main>
  )
}
