# plugin-dynamics-cifv2

This Flex plugin demonstrates the integration of Flex with Dynamics 365 apps such as `Omnichannel for Customer Service`, via CIF v2. It implements a few specific use cases and is meant for demonstration purposes only.

The Channel Integration Framework (CIF) allows comunications and contact center applications to be iframed inside a Dynamics 365 window. Such an application provides Omnichannel with access to what is termed a "channel provider" by Microsoft. This plugin shows how Twilio Flex can act as a channel provider, integrating with model-driven apps that support CIF v2.

This plugin will "pop" Case records in Dynamics when an inbound Twilio task (e.g., call, SMS, webchat) is routed to a Dynamics user. To do so, it relies on specific data being passed as attributes of the Twilio task that is routed to the user. Specifically, it expects to be passed the following task attributes:
- name: the first and last name of the customer, separated by a blank space
- contactId: the Contact ID of the customer for the Case; this contact should exist in the database
- incidentId: the Case incident ID
- ticketNumber: the Case ticket number

Typically, this data is determined during the triage or self-service phase of the customer interaction. To facilitate that, this plugin provides some sample Twilio Serverless Functions (see the `plugin-dynamics-serverless` subfolder) that make use of the Dynamics web API to look up a Contact and create a Case. These or similar functions would be called from server-side code (e.g. from a Studio flow) prior to routing.

In this sample, the `findContactByPhoneNum` function can be used to look up a customer's Contact object by phone number. It expects to be passed a `phoneNum` parameter key when called.

The `createCase` function demonstrates creating a Case object in Dynamics. It expects to be passed the following parameter keys when called:
- contactid: the Contact ID of the customer for the Case; this contact should exist in the database
- caseorigincode: (1=phone, 2=email, 3=web, see docs for others)
- casetypecode: (1=question, 2=problem, 3=request)
- title: will generate a new Subject object with the given title
- productName: (optional) the name of an existing, active product in the Sales Hub
- description: (optional) a case description string
- subject: (optional) a case subject line

Notes
- Additional valid incident properties, if supplied, will be submitted by the `createCase` function to the Dynamics API. These are documented at https://docs.microsoft.com/en-us/dynamics365/customer-engagement/web-api/incident?view=dynamics-ce-odata-9.
- If string parameters need URL-encoding prior to submission to a Serverless function, this can be done in Studio using the Liquid language like this: `{{ widgets.fnDataDip.parsed.suspectStr | url_encode }}`. See createCase.protected.js for examples.

The following use cases are supported by this plugin:
- A task is routed to a Flex agent and the plugin uses CIF (`searchAndOpenRecords`) to request navigation to the specified Case object inside a new tab. The Flex control panel - if minimized - will be docked so the user has access to telephony or chat controls for communicating with the customer.
- For multi-tasking users, multiple customer interactions can be "popped" in separate Dynamics tabs. In the Flex pane, the user can switch between active tasks; the corresponding Dynamics Case or Contact tab will be made active to maintain synchronization between task and customer/case information.
- The user can click-to-dial the Contact, which initiates an outbound voice task in Flex and dials the customer phone number configured in the Contact object.
- When the last active task is ended and wrapped up by the user, the Flex panel will auto-minimize.
- It is up to the user to explicitly close Case and Contact tabs in the Dynamics application.

## Dynamics/Omnichannel Setup
Dynamics 365 administrators can configure the major Dynamics features and channels to be presented to agents with Omnichannel. They can control which agents are presented with a particular set of features. This control is administered by configuring “application profiles” with a set of features, native channels and channel providers, and then assigning users to the appropriate profile. Thus, if a set of agents should have Flex in their Omnichannel application, then their application profile should be configured with the channel provider for Flex.

### Create Application Profile
In Dynamics, the following setup steps are required to link a user of an Omnichannel application, such as `Omnichannel for Customer Service` or `Customer Service Workspace`, with Flex via CIF v2.
- Go to [Powerapps](https://make.powerapps.com).
- Select the ‘Apps’ menu.
- Ensure the correct Dynamics organization is selected.
- Select the ellipsis to the right of your app (e.g., Omnichannel for Customer Service) and choose App Profile Manager.
- Make an application profile. Give it a name, unique name, etc.
- Select the Channels menu and add a channel provider. Fill out the form. Note, this is done in the same way as with CIF v1 but the API version will be ‘2’ (it’s the only option available). Note the following field values:
  - Unique Name: must be of the form xxxxx_yyyy e.g., “flex_cifv2” (the length is unimportant but underscore character is required)
  - Channel URL: https://flex.twilio.com/agent-desktop
  - Trusted Domain: https://flex.twilio.com
  - Custom Parameters: leave blank
- NOTE: Do NOT add the channel provider from the Channel Integration Framework application as is done with CIF v1. Providers added there are ignored by CIF v2.
- Now go back to the PowerApps browser tab and select the new channel provider using the search-by-name control. Save the profile.

### Assign Users to the Application Profile
- Select the ‘Assign users’ menu near the top of the application profile page to assign users to the profile. This brings up a new browser tab.
- Use the ‘Add Existing User’ menu to search for and assign users to the application profile.

### Provision the Omnichannel Application
- Follow the Omnichannel provisioning instructions here: https://docs.microsoft.com/en-us/dynamics365/customer-service/omnichannel-provision-license 
- Under ‘Microsoft 365 admin center’, select ‘Power Apps’ (which is really the Power Platform admin center).
- Select the correct Environment under  the ‘Environments’ menu on the left.
- Click on the ellipsis next to Omnichannel for Customer Service and choose the ‘Manage’ menu item, which will open up the ‘Omnichannel set up’ page.
- Select “add environment” and then add and configure the required native channels. Note: there is no need to add channels that will be provided by Twilio in Flex.
- On the confirmation page click ‘Finish’ to confirm the selected channels; this can take 30 minutes or more to complete.

## Twilio Setup
Make sure you have [Node.js](https://nodejs.org) as well as [`npm`](https://npmjs.com) installed.

Afterwards, install the dependencies by running `npm install`:

```bash
cd plugin-dynamics-cifv2

# If you use npm
npm install
```

## Serverless Functions
This project uses a handful of sample Twilio serverless functions that need to be deployed. The project structure conforms to the requirements of the [Twilio Serverless Toolkit](https://www.twilio.com/docs/labs/serverless-toolkit). That means the serverless functions required by the plugin can be modified, tested locally and deployed with the Serverless CLI tool. These functions are located in the `plugin-dynamics-serverless` subfolder. After setting the Twilio CLI to use the correct Twilio project, you can use the command `twilio serverless:deploy` to build and deploy the functions.

## Configuration
The serverless functions depend on a set of environment variables. Those are documented in the module comment-block inside `dynamicsHelpers.protected.js`. A sample environment file, `.env.sample`, is located in the `plugin-dynamics-serverless` subfolder. It should be copied to `.env` to be edited with the correct values.

Similarly, the client application depends on environment variables during development and testing against the local web server. These variables are also used when the plugin is built and deployed to the Twilio cloud (see below). For this, the project contains a sample environment file, `.env.sample`, in the root folder. Again, it should be copied to `.env` for editing with the correct values. Note that this file provides so-called "React environment variables" whose names must start with the string, `REACT_APP_`.

## Development
Run `twilio flex:plugins --help` to see all the commands currently supported by the Flex Plugins CLI. For further details refer to documentation on the [Flex Plugins CLI docs](https://www.twilio.com/docs/flex/developer/plugins/cli) page.

## Deploy
The plugin can be built and deployed with the `deploy` command of the Flex CLI. To be activated in your Flex project runnning at `flex.twilio.com` you must use the `release` command. This allows you to install this and, optionally, other Flex plugins together. Again, refer to the docs cited above for more information.

## WARNING
This code is supplied on a best-effort basis, without warranty, and should be carefully reviewed and tested prior to use. It is provided for instructional purposes only. Also, it makes use of a personal npm package by the author (i.e., `jlafer-twilio-runtime-util`). That package should not be treated as production-grade and you are advised to use with care.
