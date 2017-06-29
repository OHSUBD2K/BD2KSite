# Updating the modules

Use the module\_details template from the BD2KSite repo.

Fill out the information for the module.

Every bit of information that you need to add is highlighted with &quot;\*\*\* [Text] \*\*\*\*&quot;

On line 40 of the template is a snippet of code for the topics.html list of completed modules.

Module code is BDK##, e.g. BDK15

Module title is the actual title of the module

The link to the GitHub is the repo link. This is important. The script uses this bit to pull in the info that moves the list down. Also, if the user has javascript turned off, it provides a direct link to the various github repos.

Note about GitHub repo naming: Please continue to have the format of [Module code-Module title], such as BDK13 Learn FHIR. Git hub adds the dashes when the repo is created. This is the format the script on the dmice.ohsu.com/bd2k parses to find the right info to pull in for the pop down info.

There is a commented out section for adding in Example online presentations, but the chances of using that are slim.

Copy the snipet for the topics.html, from the &lt;li&gt; to the &lt;/li&gt;. Paste after the last module, currently BDK22.

Once you have filled out the information, save the template as [Module code].html (BDK13.html) and save the topics.html file when the new module is added to the list.

# Uploading to the server

The server address is &quot;dmice.ohsu.edu&quot;

This can only be accessed on campus or via VPN.

Use your favorite SFTP client, like CyberDuck or something.

Log in with your OHSU user name.

A message about the server may appear. Basically, don&#39;t do bad things on it.

Enter your password when prompted.

Go into the bd2k directory.

Upload the new module info, named BDK##.html and upload the updated topics.html.

Check your work by going to the site.