export default function TestPage() {
  return (
    <main>
      <div className="container">
        <h1>Plant Tracker Theme Test</h1>
        <p>This is our earthy minimal theme with natural colors and subtle textures.</p>
        
        <section className="mt-4">
          <h2>Buttons</h2>
          <div className="flex gap-2">
            <button>Primary Button</button>
            <button className="secondary">Secondary Button</button>
            <button className="destructive">Delete</button>
          </div>
        </section>

        <section className="mt-4">
          <h2>Cards</h2>
          <div className="grid grid-3">
            <article>
              <h3>Tomato Plant</h3>
              <p className="text-muted">Planted 3 days ago</p>
              <span className="badge success">Growing</span>
            </article>
            
            <article>
              <h3>Basil</h3>
              <p className="text-muted">Planted 1 week ago</p>
              <span className="badge warning">Needs Water</span>
            </article>
            
            <article>
              <h3>Mint</h3>
              <p className="text-muted">Planted 2 weeks ago</p>
              <span className="badge info">Flowering</span>
            </article>
          </div>
        </section>

        <section className="mt-4">
          <h2>Form Elements</h2>
          <div className="card">
            <h3>Add New Plant</h3>
            <form className="flex flex-col gap-2">
              <input type="text" placeholder="Plant name" />
              <select>
                <option>Choose species...</option>
                <option>Tomato</option>
                <option>Basil</option>
                <option>Mint</option>
              </select>
              <textarea placeholder="Notes about your plant..." rows={3}></textarea>
              <button type="submit">Add Plant</button>
            </form>
          </div>
        </section>

        <section className="mt-4">
          <h2>Typography</h2>
          <h1>Heading 1</h1>
          <h2>Heading 2</h2>
          <h3>Heading 3</h3>
          <h4>Heading 4</h4>
          <p>Regular paragraph text with <a href="#">a link</a> included.</p>
          <p className="text-muted">Muted text for secondary information.</p>
          <p className="text-small">Small text for captions.</p>
          <p className="text-large">Large text for emphasis.</p>
        </section>
      </div>
    </main>
  )
}