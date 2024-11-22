import './CreateSpot.css';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useModal } from '../../context/Modal';
import { addSpot } from '../../store/spots';
import { useDispatch } from 'react-redux';
import { csrfFetch } from '../../store/csrf';


function CreateSpot() {
  const navigate = useNavigate();
  const sessionUser = useSelector(state => state.session.user);
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);
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
    const newErrors = {};
    if (!country) newErrors.country = "Country is required";
    if (!address) newErrors.address = "Address is required";
    if (!city) newErrors.city = "City is required";
    if (!state) newErrors.state = "State is required";
    if (!description) newErrors.description = "Description is required";
    if (!name) newErrors.name = "Name is required";
    if (!price) newErrors.price = "Price is required";
    if (!previewImage) {
      newErrors.previewImage = "Preview image is required";
    } else {
      const validExtensions = ['.png', '.jpg', '.jpeg'];
      const extension = previewImage.slice(previewImage.lastIndexOf('.')).toLowerCase();
      if (!validExtensions.includes(extension)) {
        newErrors.previewImage = "Image URL must end in .png, .jpg, or .jpeg";
      }
    }

    if (isNaN(lat) || lat < -90 || lat > 90) {
      newErrors.lat = "Latitude must be a number between -90 and 90";
    }

    
     if (isNaN(lng) || lng < -180 || lng > 180) {
      newErrors.lng = "Longitude must be a number between -180 and 180";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    const newSpot = {
      ownerId: sessionUser?.id,
      name,
      description,
      price: parseFloat(price),
      address,
      city,
      state,
      country,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      previewImage
    };

    console.log('New spot data:', newSpot);

    try {
      const response = await csrfFetch('/api/spots', {
        method: 'POST',
        body: JSON.stringify(newSpot),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const createdSpot = await response.json();
        console.log('Created spot:', createdSpot);
        dispatch(addSpot(createdSpot));
        closeModal();
        navigate('/');
      } else {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        setErrors(errorData.errors || { general: "An error occurred while creating the spot." });
      }
    } catch (error) {
      console.error('Failed to create spot:', error);
      if (error instanceof Response) {
        const errorData = await error.json();
        console.error('Error details:', errorData);
        setErrors(errorData.errors || { general: "An error occurred while creating the spot." });
      } else {
        setErrors({ general: "An unexpected error occurred." });
      }
    }
  };

  return (
    <div className="create-spot">
      <h1>Create a new Holiday Haven</h1>
      <form onSubmit={handleSubmit}>
        <section>
          <h2>Where&apos;s your place located?</h2>
          <p>Guests will only get your exact address once they&apos;ve booked a reservation.</p>
          <label>
            Country
            {errors.country && <p style={{color: 'red'}}>{errors.country}</p>}
            <input type="text" value={country || ''} 
            onChange={(e) => setCountry(e.target.value)} />
          </label>
          <label>
            Street Address
            {errors.address && <p style={{color: 'red'}}>{errors.address}</p>}
            <input type="text" 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} />
          </label>
          <div className="city-state">
            <label>
              City
              {errors.city && <p style={{color: 'red'}}>{errors.city}</p>}
              <input type="text" 
              value={city} 
              onChange={(e) => setCity(e.target.value)} />
            </label>
            <label>
              State
              {errors.state && <p style={{color: 'red'}}>{errors.state}</p>}
              <input type="text" 
              value={state}
               onChange={(e) => setState(e.target.value)} />
            </label>
          </div>
          <div className="lat-lng">
            <div>
              <label htmlFor="lat">Latitude:</label>
              <input
                id="lat"
                name="text"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="lng">Longitude:</label>
              <input
                id="lng"
                name="text"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
              />
            </div>
          </div>
        </section>
        <hr className="section-divider" />

        <section>
          <h2>Describe your place to guests</h2>
          <p>Mention the best features of your Holiday Haven, any special amenities like fast wifi or parking, and what you love about the neighborhood</p>
          {errors.description && <p style={{color: 'red'}}>{errors.description}</p>}
          <textarea 
            value={description} 
            onChange={(e) => setDescription(e.target.value)} 
            minLength="30"
            placeholder="Please write at least 30 characters"
          />
        </section>
        <hr className="section-divider" />
        <section>
          <h2>Create a title for your Holiday Haven</h2>
          <p>Catch guests&apos; attention with a spot title that highlights what makes your place special.</p>
          {errors.name && <p style={{color: 'red'}}>{errors.name}</p>}
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            maxLength="50"
            placeholder="Name of your spot"
          />
        </section>
        <hr className="section-divider" />
        <section>
          <h2>Set a base price for your spot</h2>
          <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
          <label>
            $ 
            {errors.price && <p style={{color: 'red'}}>{errors.price}</p>}
            <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} min="0" step="0.01" />
          </label>
        </section>
        <hr className="section-divider" />
        <section>
          <h2>Liven up your spot with photos</h2>
          <p>Submit a link to at least one photo to publish your spot.</p>
          <input 
            type="url" 
            value={previewImage} 
            onChange={(e) => setPreviewImage(e.target.value)} 
            placeholder="Preview Image URL" 
          />
          {errors.previewImage && <p style={{color: 'red'}}>{errors.previewImage}</p>}
          <input type="url" value={image1} onChange={(e) => setImage1(e.target.value)} placeholder="Image URL" />
          <input type="url" value={image2} onChange={(e) => setImage2(e.target.value)} placeholder="Image URL" />
          <input type="url" value={image3} onChange={(e) => setImage3(e.target.value)} placeholder="Image URL" />
          <input type="url" value={image4} onChange={(e) => setImage4(e.target.value)} placeholder="Image URL" />
        </section>
        <hr className="section-divider" />

        <button type="submit">Create Spot</button>
      </form>
    </div>
  );
}

export default CreateSpot;
