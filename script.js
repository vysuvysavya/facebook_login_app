window.fbAsyncInit = function() {
    FB.init({
      appId      : '1484609442183223',  // Replace with your Facebook App ID
      cookie     : true,           // Enable cookies to allow the server to access the session
      xfbml      : true,           // Parse social plugins on this page
      version    : 'v16.0'         // Use the latest Facebook Graph API version
    });
  
    FB.AppEvents.logPageView();
    
    // Check login status when SDK is ready
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  };
  
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }
  
  function statusChangeCallback(response) {
    console.log('statusChangeCallback', response);  // Debugging
    if (response.status === 'connected') {
      getUserData(response.authResponse.accessToken);
    } else {
      FB.login(function(response) {
        console.log('FB.login response', response);  // Debugging
        if (response.authResponse) {
          getUserData(response.authResponse.accessToken);
        } else {
          console.log('User cancelled login or did not fully authorize.');
        }
      }, {scope: 'public_profile,email,pages_show_list,pages_read_engagement'});
    }
  }
  
  function getUserData(accessToken) {
    FB.api('/me', {fields: 'name,picture'}, function(response) {
      console.log('User Data:', response);  // Debugging
      if (response && !response.error) {
        document.getElementById('userName').innerText = 'Welcome, ' + response.name;
        document.getElementById('userPicture').src = response.picture.data.url;
        document.getElementById('user-info').style.display = 'block';
        getUserPages(accessToken);
      } else {
        console.log('Error fetching user data:', response.error);
      }
    });
  }
  
  function getUserPages(accessToken) {
    FB.api('/me/accounts', function(response) {
      console.log('User Pages:', response);  // Debugging
      if (response && !response.error) {
        let pages = response.data;
        let pageDropdown = document.getElementById('pageDropdown');
        pages.forEach(function(page) {
          let option = document.createElement('option');
          option.value = page.id;
          option.text = page.name;
          pageDropdown.appendChild(option);
        });
        document.getElementById('page-selector').style.display = 'block';
      } else {
        console.log('Error fetching pages:', response.error);
      }
    });
  }
  
  document.getElementById('get-insights-button').addEventListener('click', function() {
    let selectedPageId = document.getElementById('pageDropdown').value;
    FB.api(`/${selectedPageId}/insights?metric=page_fan_adds,page_engaged_users,page_impressions,page_total_actions&period=total_over_range&since=YYYY-MM-DD&until=YYYY-MM-DD`, function(response) {
      console.log('Page Insights:', response);  // Debugging
      if (response && !response.error) {
        displayPageInsights(response.data);
      } else {
        console.log('Error fetching insights:', response.error);
      }
    });
  });
  
  function displayPageInsights(insights) {
    let totalFollowers = insights.find(metric => metric.name === 'page_fan_adds').values[0].value;
    let totalEngagement = insights.find(metric => metric.name === 'page_engaged_users').values[0].value;
    let totalImpressions = insights.find(metric => metric.name === 'page_impressions').values[0].value;
    let totalReactions = insights.find(metric => metric.name === 'page_total_actions').values[0].value;
  
    document.getElementById('totalFollowers').innerText = totalFollowers;
    document.getElementById('totalEngagement').innerText = totalEngagement;
    document.getElementById('totalImpressions').innerText = totalImpressions;
    document.getElementById('totalReactions').innerText = totalReactions;
  
    document.getElementById('insights-section').style.display = 'block';
  }
  