import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import './CreateSpot.css';


function CreateSpot() {
  const navigate = useNavigate();
  const sessionUser = useSelector(state => state.session.user);

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [previewImage, setPreviewImage] = useState('');
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  const [image4, setImage4] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!sessionUser) {
      setErrors({ user: "You must be logged in to create a spot." });
      return;
    }

    const newSpot = {
      ownerId: sessionUser.id,
      name,
      description,
      price: parseFloat(price),
      address,
      city,
      state,
      country,
      previewImage
    };

    try {
      console.log('Spot created:', newSpot);
      navigate('/');
    } catch (error) {
      console.error('Failed to create spot:', error);
      setErrors(error.errors || { general: "An error occurred while creating the spot." });
    }
  };

  return (
    <div className="create-spot">
      <h1>Create a new Spot</h1>
      {errors.user && <p className="error">{errors.user}</p>}
      {errors.general && <p className="error">{errors.general}</p>}
      <form onSubmit={handleSubmit}>
        <section>
          <h2>Where&apos;s your place located?</h2>
          <p>Guests will only get your exact address once they&apos;ve booked a reservation.</p>
          <label>
            Country
            <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} required />
          </label>
          <label>
            Street Address
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required />
          </label>
          <div className="city-state">
            <label>
              City
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} required />
            </label>
            <label>
              State
              <input type="text" value={state} onChange={(e) => setState(e.target.value)} required />
            </label>
          </div>
        </section>

        <section>
          <h2>Describe your place to guests</h2>
          <p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            required 
            minLength="30"
            placeholder="Please write at least 30 characters"
          />
        </section>

        <section>
          <h2>Create a title for your spot</h2>
          <p>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            maxLength="50"
            placeholder="Name of your spot"
          />
        </section>

        <section>
          <h2>Set a base price for your spot</h2>
          <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
          <label>
            $ <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required min="0" step="0.01" />
          </label>
        </section>

        <section>
          <h2>Liven up your spot with photos</h2>
          <p>Submit a link to at least one photo to publish your spot.</p>
          <input type="url" value={previewImage} onChange={(e) => setPreviewImage(e.target.value)} required placeholder="Preview Image URL" />
          {errors.previewImage && <p className="error">{errors.previewImage}</p>}
          <input type="url" value={image1} onChange={(e) => setImage1(e.target.value)} placeholder="Image URL" />
          <input type="url" value={image2} onChange={(e) => setImage2(e.target.value)} placeholder="Image URL" />
          <input type="url" value={image3} onChange={(e) => setImage3(e.target.value)} placeholder="Image URL" />
          <input type="url" value={image4} onChange={(e) => setImage4(e.target.value)} placeholder="Image URL" />
        </section>

        <button type="submit">Create Spot</button>
      </form>
    </div>
  );
}

export default CreateSpot;
