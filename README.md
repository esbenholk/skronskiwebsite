// | cat >build/\_redirects

# React App with @React-Three/fiber (and assocaited)

React Template Site for Netlify with Sanity CMS

run Yarn Start to open development

SANITY NOTES
run npm -y create sanity@latest to create new Sanity Project, or create one from the Sanitz UI @ https://www.sanity.io/manage and insert the Sanity Project ID in /src/client
cd into Sanity Directory and run Sanity Start to start development CMS
Sanity Deploy to push to Sanity.IO hosting
Both for local production and deploy, the sanity project needs to have adjusted its CORS permissions by giving localhost3000 and future deploy url access on https://www.sanity.io/manage/personal/project/qx8f23wj/api#cors-origins

////PUSH TO GIT
remove existing git reference,
run git init,
create new repo on git ui
run git remote add origin newGitUrl
ensure that .gitignore includes the Sanity Directory /templatestarter

git push

///NETLIFY
build from git
