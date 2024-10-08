window.fbAsyncInit = function() {
    FB.init({
        appId: '1484609442183223', 
        cookie: true, 
        xfbml: true, 
        version: 'v16.0' 
    });

    FB.AppEvents.logPageView();
    
    // Check login status when SDK is ready
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
};

// Load the Facebook SDK asynchronously
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}

function statusChangeCallback(response) {
    console.log('statusChangeCallback', response); // Debugging
    if (response.status === 'connected') {
        getUserData(response.authResponse.accessToken);
    } else {
        document.getElementById('fb-login-button').disabled = false;
    }
}

document.getElementById('fb-login-button').addEventListener('click', function() {
    FB.login(function(response) {
        console.log('FB.login response', response); // Debugging
        if (response.authResponse) {
            getUserData(response.authResponse.accessToken);
        } else {
            console.log('User cancelled login or did not fully authorize.');
        }
    }, {scope: 'public_profile,email,pages_show_list,pages_read_engagement'});
});

function getUserData(accessToken) {
    FB.api('/me', {fields: 'name,picture'}, function(response) {
        console.log('User Data:', response); // Debugging
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
        console.log('User Pages:', response); // Debugging
        if (response && !response.error) {
            let pages = response.data;
            let pageDropdown = document.getElementById('pageDropdown');
            pageDropdown.innerHTML = ''; // Clear existing options
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
    let sinceDate = '2024-01-01'; // Replace with your desired start date
    let untilDate = '2024-12-12'; // Replace with your desired end date
    FB.api(`/${selectedPageId}/insights?metric=page_fan_adds,page_engaged_users,page_impressions,page_total_actions&period=total_over_range&since=${sinceDate}&until=${untilDate}`, function(response) {
        console.log('Page Insights:', response); // Debugging
        if (response && !response.error) {
            displayPageInsights(response.data);
        } else {
            console.log('Error fetching insights:', response.error);
        }
    });
});

function displayPageInsights(insights) {
    let totalFollowers = insights.find(metric => metric.name === 'page_fan_adds')?.values[0]?.value || 'N/A';
    let totalEngagement = insights.find(metric => metric.name === 'page_engaged_users')?.values[0]?.value || 'N/A';
    let totalImpressions = insights.find(metric => metric.name === 'page_impressions')?.values[0]?.value || 'N/A';
    let totalReactions = insights.find(metric => metric.name === 'page_total_actions')?.values[0]?.value || 'N/A';

    document.getElementById('totalFollowers').innerText = totalFollowers;
    document.getElementById('totalEngagement').innerText = totalEngagement;
    document.getElementById('totalImpressions').innerText = totalImpressions;
    document.getElementById('totalReactions').innerText = totalReactions;

    document.getElementById('insights-section').style.display = 'block';
}
