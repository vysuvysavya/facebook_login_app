// Initialize Facebook SDK
window.fbAsyncInit = function() {
    FB.init({
      appId      : '1484609442183223',  // Replace with your Facebook App ID
      cookie     : true,           // Enable cookies to allow the server to access the session
      xfbml      : true,           // Parse social plugins on this page
      version    : 'v16.0'         // Use the latest Facebook Graph API version
    });
  
    FB.AppEvents.logPageView();
  };
  
  // Function to handle login status
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }
  
  // Callback to handle response
  function statusChangeCallback(response) {
    if (response.status === 'connected') {
      // Logged into your app and Facebook
      getUserData(response.authResponse.accessToken);
    } else {
      // Not logged in, prompt login
      FB.login(function(response) {
        if (response.authResponse) {
          getUserData(response.authResponse.accessToken);
        } else {
          console.log('User cancelled login or did not fully authorize.');
        }
      }, {scope: 'public_profile,email,pages_show_list,pages_read_engagement'});
    }
  }
  
  // Function to get user data
  function getUserData(accessToken) {
    FB.api('/me', {fields: 'name,picture'}, function(response) {
      console.log('Successful login for: ' + response.name);
      document.getElementById('userName').innerText = 'Welcome, ' + response.name;
      document.getElementById('userPicture').src = response.picture.data.url;
      document.getElementById('user-info').style.display = 'block';
    });
  }
  
  // Add event listener to login button
  document.getElementById('fb-login-button').addEventListener('click', function() {
    checkLoginState();
  });
  