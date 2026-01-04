import React from 'react';
import { Box, Container, Grid, Typography, Link, Divider, IconButton, Stack } from '@mui/material';
import { Facebook, Twitter, LinkedIn, Instagram, GitHub } from '@mui/icons-material';

const Footer = () => {
  // Current year for copyright
  const currentYear = new Date().getFullYear();
  
  // Footer navigation links
  const footerLinks = [
    {
      category: 'Product',
      links: [
        { name: 'Features', url: '#features' },
        { name: 'Pricing', url: '#pricing' },
        { name: 'Use Cases', url: '#use-cases' },
        { name: 'Integrations', url: '#integrations' }
      ]
    },
    {
      category: 'Resources',
      links: [
        { name: 'Documentation', url: '#docs' },
        { name: 'Tutorials', url: '#tutorials' },
        { name: 'Blog', url: '#blog' },
        { name: 'Support', url: '#support' }
      ]
    },
    {
      category: 'Company',
      links: [
        { name: 'About Us', url: '#about' },
        { name: 'Careers', url: '#careers' },
        { name: 'Privacy Policy', url: '#privacy' },
        { name: 'Terms of Service', url: '#terms' }
      ]
    }
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: '#1a1a2e',
        color: '#ffffff',
        pt: 8,
        pb: 4
      }}
    >
      <Container maxWidth="lg">
        {/* Main Footer Content */}
        <Grid container spacing={4} justifyContent="space-between">
          {/* Logo and company description */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                mb: 2,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Box
                component="span"
                sx={{
                  display: 'inline-block',
                  mr: 1,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  bgcolor: '#3f51b5'
                }}
              />
              NoteGenius
            </Typography>
            
            <Typography
              variant="body2"
              sx={{
                color: '#ffffffb3',
                mb: 3,
                maxWidth: 300,
                lineHeight: 1.6
              }}
            >
              Transforming the way you capture and organize information with advanced AI technology. Making note-taking smarter, faster, and more efficient.
            </Typography>
            
            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <IconButton size="small" aria-label="Facebook" sx={{ color: '#ffffffb3' }}>
                <Facebook />
              </IconButton>
              <IconButton size="small" aria-label="Twitter" sx={{ color: '#ffffffb3' }}>
                <Twitter />
              </IconButton>
              <IconButton size="small" aria-label="LinkedIn" sx={{ color: '#ffffffb3' }}>
                <LinkedIn />
              </IconButton>
              <IconButton size="small" aria-label="Instagram" sx={{ color: '#ffffffb3' }}>
                <Instagram />
              </IconButton>
              <IconButton size="small" aria-label="GitHub" sx={{ color: '#ffffffb3' }}>
                <GitHub />
              </IconButton>
            </Stack>
          </Grid>
          
          {/* Footer links columns */}
          {footerLinks.map((column) => (
            <Grid item xs={6} sm={4} md={2} key={column.category}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: '#ffffff',
                  fontWeight: 600,
                  mb: 2,
                  textTransform: 'uppercase',
                  fontSize: '0.8rem',
                  letterSpacing: 0.5
                }}
              >
                {column.category}
              </Typography>
              
              <Stack spacing={1.5}>
                {column.links.map((link) => (
                  <Link
                    key={link.name}
                    href={link.url}
                    underline="hover"
                    sx={{
                      color: '#ffffffb3',
                      fontSize: '0.9rem',
                      transition: 'color 0.2s',
                      '&:hover': {
                        color: '#ffffff'
                      }
                    }}
                  >
                    {link.name}
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}
          
          {/* Newsletter section */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="subtitle2"
              sx={{
                color: '#ffffff',
                fontWeight: 600,
                mb: 2,
                textTransform: 'uppercase',
                fontSize: '0.8rem',
                letterSpacing: 0.5
              }}
            >
              Stay Updated
            </Typography>
            
            <Typography
              variant="body2"
              sx={{
                color: '#ffffffb3',
                mb: 2,
                maxWidth: 300,
                lineHeight: 1.6
              }}
            >
              Subscribe to our newsletter for tips, product updates, and AI insights.
            </Typography>
            
            <Box
              component="form"
              noValidate
              sx={{
                display: 'flex',
                mb: 2
              }}
            >
              <Box
                component="input"
                sx={{
                  flex: 1,
                  py: 1.5,
                  px: 2,
                  border: 'none',
                  borderRadius: '4px 0 0 4px',
                  outline: 'none',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  '&::placeholder': {
                    color: '#ffffff80'
                  }
                }}
                placeholder="Email address"
                type="email"
              />
              <Box
                component="button"
                type="submit"
                sx={{
                  py: 1.5,
                  px: 2,
                  border: 'none',
                  borderRadius: '0 4px 4px 0',
                  bgcolor: '#3f51b5',
                  color: '#ffffff',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                  '&:hover': {
                    bgcolor: '#303f9f'
                  }
                }}
              >
                Subscribe
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4, borderColor: 'rgba(255, 255, 255, 0.1)' }} />
        
        {/* Footer bottom section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'center', sm: 'center' },
            textAlign: { xs: 'center', sm: 'left' }
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: '#ffffff80',
              mb: { xs: 2, sm: 0 }
            }}
          >
            &copy; {currentYear} NoteGenius. All rights reserved.
          </Typography>
          
          <Stack
            direction="row"
            spacing={3}
            sx={{
              color: '#ffffff80',
              fontSize: '0.85rem'
            }}
          >
            <Link href="#privacy" underline="hover" sx={{ color: 'inherit' }}>
              Privacy
            </Link>
            <Link href="#terms" underline="hover" sx={{ color: 'inherit' }}>
              Terms
            </Link>
            <Link href="#cookies" underline="hover" sx={{ color: 'inherit' }}>
              Cookies
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;