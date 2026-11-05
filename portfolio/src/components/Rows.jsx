import { useState } from "react";
import { finePointer } from "../lib/index.js";

// A list of rows that open in place on hover, focus or tap. Used for projects and blog posts.
export default function Rows({ items, alwaysOpen = false, id }) {
  const [open, setOpen] = useState(-1);

  return (
    <div className={`rows${alwaysOpen ? " always-open" : ""}`} id={id}>
      {items.map((x, i) => {
        const main = x.demo || x.source;
        return (
          <article key={x.title} className={`row rv ${i % 2 ? "from-right" : "from-left"}${open === i ? " open" : ""}`}>
            <a
              className="row-head"
              href={main}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                // On touch screens the first tap opens the row; the second follows the link.
                if (!finePointer && !alwaysOpen && open !== i) {
                  e.preventDefault();
                  setOpen(i);
                }
              }}
            >
              <div>
                <h3>{x.title}</h3>
                <div className="cat">{x.category}</div>
              </div>
              <span className="go" aria-hidden="true">→</span>
            </a>
            <div className="row-more">
              <div>
                <p>{x.description}</p>
                <ul className="chips">
                  {x.tags.map((t) => <li key={t}>{t}</li>)}
                </ul>
                {(x.demo && x.source) && (
                  <div className="row-links">
                    <a href={x.demo} target="_blank" rel="noopener noreferrer">Live demo ↗</a>
                    <a href={x.source} target="_blank" rel="noopener noreferrer">Source ↗</a>
                  </div>
                )}
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
