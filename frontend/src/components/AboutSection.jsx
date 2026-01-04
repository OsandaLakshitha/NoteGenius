import React from 'react';
import { Box, Container, Typography, Button, Grid, Paper } from '@mui/material';
import { AutoAwesome } from '@mui/icons-material';

const AboutSection = () => {
  return (
    <Box 
      component="section" 
      sx={{ 
        py: 12,
        background: '#ffffff',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative background element */}
      <Box 
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(63,81,181,0.08) 0%, rgba(63,81,181,0) 70%)',
          zIndex: 0
        }}
      />
      
      <Container maxWidth="lg">
        <Grid container spacing={6} alignItems="center">
          {/* Left column with content */}
          <Grid item xs={12} md={7}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography 
                variant="overline" 
                component="div"
                sx={{ 
                  color: '#3f51b5', 
                  fontWeight: 600, 
                  letterSpacing: 1.5, 
                  mb: 1 
                }}
              >
                OUR MISSION
              </Typography>
              
              <Typography
                variant="h3"
                component="h2"
                sx={{ 
                  fontWeight: 700, 
                  color: '#1a1a2e',
                  mb: 3,
                  maxWidth: '90%'
                }}
              >
                About NoteGenius
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#4a4a58',
                  mb: 3,
                  fontSize: '1.1rem',
                  lineHeight: 1.7,
                  maxWidth: '90%'
                }}
              >
                NoteGenius is an innovative platform that leverages advanced AI technology to transform how you capture and organize information. We seamlessly convert your handwritten or voice-recorded notes into structured, searchable digital text.
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#4a4a58',
                  mb: 4,
                  fontSize: '1.1rem',
                  lineHeight: 1.7,
                  maxWidth: '90%'
                }}
              >
                Whether you're a student capturing lecture insights, a professional documenting meeting outcomes, or a creative collecting inspirations, NoteGenius empowers you to stay organized and productive while focusing on what matters most.
              </Typography>
              
              <Button 
                variant="contained" 
                color="primary"
                size="large"
                startIcon={<AutoAwesome />}
                sx={{ 
                  py: 1.2,
                  px: 4,
                  borderRadius: '28px',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1.05rem',
                  boxShadow: '0 4px 14px rgba(63, 81, 181, 0.3)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(63, 81, 181, 0.4)'
                  }
                }}
              >
                Get Started
              </Button>
              
              <Button 
                variant="outlined" 
                color="primary"
                size="large"
                sx={{ 
                  py: 1.2,
                  px: 4,
                  ml: 2,
                  borderRadius: '28px',
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '1.05rem',
                  borderWidth: 2,
                  '&:hover': {
                    borderWidth: 2
                  }
                }}
              >
                Watch Demo
              </Button>
            </Box>
          </Grid>
          
          {/* Right column with stats cards */}
          <Grid item xs={12} md={5}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 3,
              position: 'relative',
              zIndex: 1 
            }}>
              {[
                { number: '95%', label: 'recognition accuracy', color: '#3f51b5' },
                { number: '3M+', label: 'notes processed', color: '#00bcd4' },
                { number: '60%', label: 'time saved on average', color: '#4caf50' }
              ].map((stat, index) => (
                <Paper 
                  key={index}
                  elevation={2}
                  sx={{
                    p: 3,
                    borderRadius: 2,
                    borderLeft: `6px solid ${stat.color}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateX(8px)',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.12)'
                    }
                  }}
                >
                  <Typography 
                    variant="h3" 
                    component="div" 
                    sx={{ 
                      fontWeight: 700, 
                      color: stat.color,
                      mb: 0.5
                    }}
                  >
                    {stat.number}
                  </Typography>
                  <Typography 
                    variant="subtitle1"
                    sx={{
                      color: '#4a4a58',
                      fontWeight: 500,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5
                    }}
                  >
                    {stat.label}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default AboutSection;