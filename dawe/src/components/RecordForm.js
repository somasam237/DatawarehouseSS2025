import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Switch,
  FormControlLabel,
  Typography,
  Divider
} from '@mui/material';

const RecordForm = ({ 
  fields, 
  initialData = {}, 
  onSubmit, 
  onCancel, 
  loading = false 
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(initialData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    fields.forEach(field => {
      if (field.required && (!formData[field.name] || formData[field.name] === '')) {
        newErrors[field.name] = t('FieldRequired');
      }
      
      if (field.validation) {
        const validationResult = field.validation(formData[field.name]);
        if (validationResult) {
          newErrors[field.name] = validationResult;
        }
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const renderField = (field) => {
    const value = formData[field.name] || '';
    const error = errors[field.name];
    
    switch (field.type) {
      case 'text':
      case 'email':
      case 'number':
      case 'date':
        return (
          <TextField
            fullWidth
            label={field.label}
            type={field.type === 'date' ? 'text' : field.type}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            error={!!error}
            helperText={error}
            required={field.required}
            multiline={field.multiline}
            rows={field.rows || 1}
            disabled={field.disabled}
            placeholder={field.type === 'date' ? 'YYYY-MM-DD' : field.placeholder}
          />
        );
        
      case 'select':
        return (
          <FormControl fullWidth error={!!error} required={field.required}>
            <InputLabel>{field.label}</InputLabel>
            <Select
              value={value}
              label={field.label}
              onChange={(e) => handleChange(field.name, e.target.value)}
            >
              {field.options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error}</FormHelperText>}
          </FormControl>
        );
        
      case 'boolean':
        return (
          <FormControlLabel
            control={
              <Switch
                checked={!!value}
                onChange={(e) => handleChange(field.name, e.target.checked)}
                disabled={field.disabled}
              />
            }
            label={field.label}
          />
        );
        
      case 'textarea':
        return (
          <TextField
            fullWidth
            label={field.label}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            error={!!error}
            helperText={error}
            required={field.required}
            multiline
            rows={field.rows || 4}
            disabled={field.disabled}
          />
        );
        
      default:
        return (
          <TextField
            fullWidth
            label={field.label}
            value={value}
            onChange={(e) => handleChange(field.name, e.target.value)}
            error={!!error}
            helperText={error}
            required={field.required}
            disabled={field.disabled}
          />
        );
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        {fields.map((field) => (
          <Grid item xs={12} sm={field.fullWidth ? 12 : 6} key={field.name}>
            {field.section && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {field.section}
                </Typography>
                <Divider sx={{ mb: 2 }} />
              </Box>
            )}
            {renderField(field)}
          </Grid>
        ))}
      </Grid>
      
      <Box sx={{ display: 'flex', gap: 2, mt: 3, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={onCancel}
          disabled={loading}
        >
          {t('Cancel')}
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
            }
          }}
        >
          {loading ? t('Saving') : t('Save')}
        </Button>
      </Box>
    </Box>
  );
};

export default RecordForm; 