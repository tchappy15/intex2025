// components/FAQSection.tsx
import { useState } from 'react';
import './FAQSection.css';

const faqs = [
  {
    question: 'What is CineNiche?',
    answer: 'CineNiche is a curated streaming platform for niche, indie, and international films you won’t find on mainstream services.',
  },
  {
    question: 'Is CineNiche free?',
    answer: 'We offer a free trial and a premium membership for full access to our film catalog.',
  },
  {
    question: 'Can I watch CineNiche offline?',
    answer: 'Currently, streaming is online-only. Offline viewing is coming soon!',
  },
  {
    question: 'How often are new films added?',
    answer: 'New films are added every week, including international releases, documentaries, and cult classics.',
  },
  {
    question: 'Can I request movies to be added?',
    answer: 'Absolutely! We love suggestions. Reach out through our Contact page or in-app feedback.',
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(prev => (prev === index ? null : index));
  };

  return (
    <div className="faq-section">
      <h2>Frequently Asked Questions</h2>
      {faqs.map((faq, i) => (
        <div key={i} className={`faq-item ${openIndex === i ? 'open' : ''}`} onClick={() => toggle(i)}>
          <div className="faq-question">
                {faq.question}
                <span className={`arrow ${openIndex === i ? 'open' : ''}`}>▸</span>
            </div>

          <div className="faq-answer">{faq.answer}</div>
        </div>
      ))}
    </div>
  );
}
