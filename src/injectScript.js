import $ from 'jquery';

function syncMentionList() {
  /* eslint-disable no-undef */
  const toList = RM.getSortedMemberList().map(id => {
    const name = CW.is_business && ST.data.private_nickname && !RM.isInternal() ? AC.getDefaultNickName(id) : AC.getNickName(id);
    return {
      key: name,
      value: `[To:${id}] ${name}`,
      img: CW.getAvatarPanel(id, {
        clicktip: !1,
        size: 'small',
      }),
    };
  });
  localStorage.setItem('CWP_ROOM_USERS', JSON.stringify(toList));
}

$(window).bind('hashchange', function(e) {
  syncMentionList();
});

setTimeout(syncMentionList, 1000);
