export default function GardenPage() {
  // Mock data for demonstration
  const plants = [
    { id: 1, name: 'Tomato', status: 'Growing', planted: '2 weeks ago', water: 'Tomorrow' },
    { id: 2, name: 'Basil', status: 'Seedling', planted: '4 days ago', water: 'Today' },
    { id: 3, name: 'Mint', status: 'Flowering', planted: '1 month ago', water: 'In 2 days' },
  ]

  return (
    <main>
      <nav>
        <div className="container flex justify-between items-center">
          <h1 style={{ margin: 0 }}>🌱 Plant Tracker</h1>
          <div>
            <a href="/">Home</a>
            <a href="/garden">Garden</a>
            <a href="/calendar">Calendar</a>
          </div>
        </div>
      </nav>

      <div className="container">
        <header className="mb-4">
          <h1>My Garden</h1>
          <p className="text-muted">Track your plants from seed to harvest</p>
        </header>

        <section className="mb-4">
          <div className="flex justify-between items-center mb-3">
            <h2>Active Plants</h2>
            <button>+ Add Plant</button>
          </div>
          
          <div className="grid grid-3">
            {plants.map(plant => (
              <article key={plant.id} className="animate-grow">
                <div className="flex justify-between items-center mb-2">
                  <h3>{plant.name}</h3>
                  <span className={`badge ${plant.status === 'Flowering' ? 'info' : plant.status === 'Seedling' ? 'success' : 'warning'}`}>
                    {plant.status}
                  </span>
                </div>
                <p className="text-small text-muted mb-2">Planted {plant.planted}</p>
                <div className="flex justify-between items-center">
                  <span className="text-small">💧 Water: {plant.water}</span>
                  <button className="secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}>
                    Care Log
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="grid grid-2 gap-3">
          <div className="card">
            <h3>Quick Add</h3>
            <form className="flex flex-col gap-2">
              <input type="text" placeholder="Plant name" />
              <select>
                <option>Select type...</option>
                <option>Vegetable</option>
                <option>Herb</option>
                <option>Flower</option>
                <option>Fruit</option>
              </select>
              <button type="submit">Add to Garden</button>
            </form>
          </div>

          <div className="card">
            <h3>Today's Tasks</h3>
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                <span>Water the Basil</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                <span>Check tomatoes for pests</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" />
                <span>Harvest mint leaves</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked />
                <span style={{ textDecoration: 'line-through', color: 'var(--muted)' }}>
                  Take photos
                </span>
              </label>
            </div>
          </div>
        </section>

        <section className="mt-4">
          <h2>Garden Stats</h2>
          <div className="grid grid-3">
            <div className="text-center">
              <p className="text-large" style={{ color: 'var(--primary)', fontWeight: 600 }}>12</p>
              <p className="text-small text-muted">Total Plants</p>
            </div>
            <div className="text-center">
              <p className="text-large" style={{ color: 'var(--secondary)', fontWeight: 600 }}>3</p>
              <p className="text-small text-muted">Ready to Harvest</p>
            </div>
            <div className="text-center">
              <p className="text-large" style={{ color: 'var(--accent)', fontWeight: 600 }}>45</p>
              <p className="text-small text-muted">Days Growing</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}