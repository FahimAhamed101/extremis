const fs = require('fs');
const path = require('path');

const pageFile = path.join(__dirname, '..', 'app', 'page.tsx');
const content = fs.readFileSync(pageFile, 'utf8');

const startMarker = '<div className="col-lg-6">';
const endMarker = '<div className="col-lg-3">\n\t\t\t\t\t\t\t\t<aside className="sidebar static right">';
const altEndMarker = '<div className="col-lg-3">\r\n\t\t\t\t\t\t\t\t<aside className="sidebar static right">';

const startIndex = content.indexOf(startMarker);
if (startIndex === -1) {
  console.error('Start marker not found!');
  process.exit(1);
}

let endIndex = content.indexOf(endMarker);
if (endIndex === -1) {
  endIndex = content.indexOf(altEndMarker);
}
if (endIndex === -1) {
  // Try regex
  const regex = /<div className="col-lg-3">\s*<aside className="sidebar static right">/;
  const match = regex.exec(content);
  if (match) {
    endIndex = match.index;
  }
}

if (endIndex === -1) {
  console.error('End marker not found!');
  process.exit(1);
}

const middleColumn = `<div className="col-lg-6">
								<div className="story-card">
									<div className="story-title">
										<h5>Recent Stories</h5>
										<a href="#" title="">See all</a>
									</div>
									<div className="story-wraper ">
										<img src="/images/resources/story-card5.jpg" alt="" />
										<div className="users-dp">
											<img src="/images/resources/user3.jpg" alt="" />
										</div>
										<a className="add-new-stry" href="#" title=""><i className="icofont-plus"></i></a>
										<span>Add Your Story</span>
									</div>
									<div className="story-wraper">
										<img src="/images/resources/story-card.jpg" alt="" />
										<div className="users-dp">
											<img src="/images/resources/user6.jpg" alt="" />
										</div>
										<span>Tamana Bhatia</span>
									</div>
									<div className="story-wraper">
										<img src="/images/resources/story-card2.jpg" alt="" />
										<div className="users-dp">
											<img src="/images/resources/user7.jpg" alt="" />
										</div>
										<span>Emily Caros</span>
									</div>
									<div className="story-wraper">
										<img src="/images/resources/story-card3.jpg" alt="" />
										<div className="users-dp">
											<img src="/images/resources/user8.jpg" alt="" />
										</div>
										<span>Daniel Cardos</span>
									</div>
									<div className="story-wraper">
										<img src="/images/resources/story-card4.jpg" alt="" />
										<div className="users-dp">
											<img src="/images/resources/user4.jpg" alt="" />
										</div>
										<span>Emma Watson</span>
									</div>
								</div>
								<div className="main-wraper">
									<div className="chatroom-title">
										<i>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-tv"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><polyline points="17 2 12 7 7 2"></polyline></svg></i>
										<span>Chat Rooms <em>Video chat with friends</em></span>
										<a className="create-newroom" href="#" title="">Create Room</a>
									</div>
									<ul className="chat-rooms">
										<li>
											<div className="room-avatar">
												<img src="/images/resources/user2.jpg" alt="" />
												<span className="status online"></span>
											</div>
											<span>Sara&apos;s Room</span>
											<a className="join" href="#" title="Join Room">Join</a>
											<a className="say-hi send-mesg" href="#" title="Send Message"><i className="icofont-facebook-messenger"></i></a>
										</li>
										<li>
											<div className="room-avatar">
												<img src="/images/resources/user3.jpg" alt="" />
												<span className="status offline"></span>
											</div>
											<span>jawad&apos;s Room</span>
											<a className="join" href="#" title="Join Room">Join</a>
											<a className="say-hi send-mesg" href="#" title="Send Message"><i className="icofont-facebook-messenger"></i></a>
										</li>
										<li>
											<div className="room-avatar">
												<img src="/images/resources/user4.jpg" alt="" />
												<span className="status away"></span>
											</div>
											<span>Jack&apos;s Room</span>
											<a className="join" href="#" title="Join Room">Join</a>
											<a className="say-hi send-mesg" href="#" title="Send Message"><i className="icofont-facebook-messenger"></i></a>
										</li>
										<li>
											<div className="room-avatar">
												<img src="/images/resources/user5.jpg" alt="" />
												<span className="status online"></span>
											</div>
											<span>jobidn&apos;s Room</span>
											<a className="join" href="#" title="Join Room">Join</a>
											<a className="say-hi send-mesg" href="#" title="Send Message"><i className="icofont-facebook-messenger"></i></a>
										</li>
										<li>
											<div className="room-avatar">
												<img src="/images/resources/user6.jpg" alt="" />
												<span className="status offline"></span>
											</div>
											<span>Emily&apos;s Room</span>
											<a className="join" href="#" title="Join Room">Join</a>
											<a className="say-hi send-mesg" href="#" title="Send Message"><i className="icofont-facebook-messenger"></i></a>
										</li>
									</ul>
								</div>
								<HomeFeedClient />
							</div>
							`;

const updatedContent = content.slice(0, startIndex) + middleColumn + content.slice(endIndex);
fs.writeFileSync(pageFile, updatedContent, 'utf8');
console.log('Successfully cleaned app/page.tsx, replaced static posts with HomeFeedClient and CreatePostCard!');
