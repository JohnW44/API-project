import './CreateSpot.css';
import { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { createSpot, updateExistingSpot } from '../../store/spots';
import { useModal } from '../../context/Modal';

function CreateSpot() {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const existingSpot = useSelector(state => state.spots.spotsObj[spotId]);
  const { 
    formData, 
    formErrors, 
    updateFormField, 
    resetForm, 
    validateSpotForm, 
    setFormErrors 
  } = useModal();

  const initializeForm = useCallback(() => {
    if (spotId && existingSpot) {
      const formattedSpot = {
        ...existingSpot,
        previewImage: existingSpot.previewImage || '',
        image1: existingSpot.image1 || '',
        image2: existingSpot.image2 || '',
        image3: existingSpot.image3 || '',
        image4: existingSpot.image4 || ''
      };
      resetForm(formattedSpot);
    } else {
      resetForm();
    }
  }, [spotId, existingSpot, resetForm]);

  useEffect(() => {
    initializeForm();
  }, [initializeForm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateSpotForm()) return;

    const spotData = {
      ...formData,
      lat: parseFloat(formData.lat),
      lng: parseFloat(formData.lng),
      price: parseFloat(formData.price)
    };

    try {
      let response;
      if (spotId) {
        response = await dispatch(updateExistingSpot(spotId, spotData));
        if (response && !response.errors) {
          navigate(`/spots/${spotId}`);
        } else if (response && response.errors) {
          setFormErrors(response.errors);
        }
      } else {
        response = await dispatch(createSpot(spotData));
        if (response && response.id) {
          navigate(`/spots/${response.id}`);
        } else if (response && response.errors) {
          setFormErrors(response.errors);
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormErrors({ submit: 'An error occurred while submitting the form' });
    }
  };

  return (
    <div className="create-spot">
      <h1>{spotId ? "Update your Holiday Haven" : "Create a new Holiday Haven"}</h1>
      <form onSubmit={handleSubmit}>
        <section>
          <h2>Where&apos;s your place located?</h2>
          <p>Guests will only get your exact address once they&apos;ve booked a reservation.</p>
          <label>
            Country
            {formErrors.country && <p className="error">{formErrors.country}</p>}
            <input
              type="text"
              value={formData.country || ''}
              onChange={(e) => updateFormField('country', e.target.value)}
            />
          </label>
          <label>
            Street Address
            {formErrors.address && <p className="error">{formErrors.address}</p>}
            <input
              type="text"
              value={formData.address}
              onChange={(e) => updateFormField('address', e.target.value)}
            />
          </label>
          <div className="city-state">
            <label>
              City
              {formErrors.city && <p className="error">{formErrors.city}</p>}
              <input
                type="text"
                value={formData.city}
                onChange={(e) => updateFormField('city', e.target.value)}
              />
            </label>
            <label>
              State
              {formErrors.state && <p className="error">{formErrors.state}</p>}
              <input
                type="text"
                value={formData.state}
                onChange={(e) => updateFormField('state', e.target.value)}
              />
            </label>
          </div>
          <div className="lat-lng">
            <div>
              <label htmlFor="lat">Latitude:</label>
              <input
                id="lat"
                type="number"
                step="any"
                value={formData.lat}
                onChange={(e) => updateFormField('lat', e.target.value)}
              />
              {formErrors.lat && <p className="error">{formErrors.lat}</p>}
            </div>
            <div>
              <label htmlFor="lng">Longitude:</label>
              <input
                id="lng"
                type="number"
                step="any"
                value={formData.lng}
                onChange={(e) => updateFormField('lng', e.target.value)}
              />
              {formErrors.lng && <p className="error">{formErrors.lng}</p>}
            </div>
          </div>
        </section>
        <hr className="section-divider" />

        <section>
          <h2>Describe your place to guests</h2>
          <p>Mention the best features of your Holiday Haven, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
          {formErrors.description && <p className="error">{formErrors.description}</p>}
          <textarea
            value={formData.description}
            onChange={(e) => updateFormField('description', e.target.value)}
          />
        </section>
        <hr className="section-divider" />
        <section>
          <h2>Create a title for your Holiday Haven</h2>
          <p>Catch guests attention with a spot title that highlights what makes your place special.</p>
          {formErrors.name && <p className="error">{formErrors.name}</p>}
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateFormField('name', e.target.value)}
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
            {formErrors.price && <p className="error">{formErrors.price}</p>}
            <input
              type="number"
              value={formData.price}
              onChange={(e) => updateFormField('price', e.target.value)}
              min="0"
              step="0.01"
            />
          </label>
        </section>
        <hr className="section-divider" />
        <section>
          <h2>Liven up your spot with photos</h2>
          <p>Submit a link to at least one photo to publish your spot.</p>
          
          {/* Preview/Main Image */}
          <label>
            Preview Image
            <input
              type="url"
              value={formData.previewImage}
              onChange={(e) => updateFormField('previewImage', e.target.value)}
              placeholder="Preview Image URL (Required)"
            />
            {formErrors.previewImage && <p className="error">{formErrors.previewImage}</p>}
          </label>

          {/* Additional Images */}
          {[1, 2, 3, 4].map((num) => (
            <label key={num}>
              Image {num}
              <input
                type="url"
                value={formData[`image${num}`] || ''}
                onChange={(e) => updateFormField(`image${num}`, e.target.value)}
                placeholder={`Image ${num} URL (Optional)`}
              />
              {formErrors[`image${num}`] && <p className="error">{formErrors[`image${num}`]}</p>}
            </label>
          ))}
        </section>
        <hr className="section-divider" />

        <button type="submit">{spotId ? 'Update Spot' : 'Create Spot'}</button>
      </form>
    </div>
  );
}

export default CreateSpot;
