const RULE_ID_OFFSET = 1000;

async function updateBlockingRules() {
  try {
    const result = await chrome.storage.local.get(['blockedSites', 'blockedKeywords', 'protectionEnabled', 'isPaused']);
    const blockedSites = result.blockedSites || [];
    const blockedKeywords = result.blockedKeywords || [];
    const protectionEnabled = result.protectionEnabled !== false;
    const isPaused = result.isPaused || false;

    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const existingRuleIds = existingRules.map(rule => rule.id);

    if (existingRuleIds.length > 0) {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: existingRuleIds
      });
    }

    if (!protectionEnabled || isPaused) {
      console.log('Protection disabled or paused, no rules added');
      return;
    }

    const rules = [];
    let ruleId = RULE_ID_OFFSET;

    blockedSites.forEach((site) => {
      const domain = site.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0];

      rules.push({
        id: ruleId++,
        priority: 1,
        action: {
          type: 'redirect',
          redirect: {
            url: chrome.runtime.getURL('blocked.html') + '?site=' + encodeURIComponent(domain)
          }
        },
        condition: {
          urlFilter: `*://*.${domain}/*`,
          resourceTypes: ['main_frame']
        }
      });

      rules.push({
        id: ruleId++,
        priority: 1,
        action: {
          type: 'redirect',
          redirect: {
            url: chrome.runtime.getURL('blocked.html') + '?site=' + encodeURIComponent(domain)
          }
        },
        condition: {
          urlFilter: `*://${domain}/*`,
          resourceTypes: ['main_frame']
        }
      });
    });

    blockedKeywords.forEach((keyword) => {
      rules.push({
        id: ruleId++,
        priority: 1,
        action: {
          type: 'redirect',
          redirect: {
            url: chrome.runtime.getURL('blocked.html') + '?keyword=' + encodeURIComponent(keyword)
          }
        },
        condition: {
          urlFilter: `*://*${keyword}*`,
          resourceTypes: ['main_frame']
        }
      });
    });

    if (rules.length > 0) {
      await chrome.declarativeNetRequest.updateDynamicRules({
        addRules: rules
      });
      console.log(`Updated blocking rules: ${rules.length} rules added`);
    }

    await recordBlockStats(blockedSites, blockedKeywords);
  } catch (error) {
    console.error('Error updating blocking rules:', error);
  }
}

async function recordBlockStats(sites, keywords) {
  const result = await chrome.storage.local.get(['userId']);
  if (!result.userId) {
    return;
  }

  try {
    const response = await fetch(`${await getSupabaseUrl()}/rest/v1/user_statistics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': await getSupabaseAnonKey(),
        'Authorization': `Bearer ${await getSupabaseAnonKey()}`,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        user_id: result.userId,
        total_sites_managed: sites.length,
        updated_at: new Date().toISOString()
      })
    });

    if (!response.ok) {
      console.error('Failed to update stats:', await response.text());
    }
  } catch (error) {
    console.error('Error recording block stats:', error);
  }
}

async function getSupabaseUrl() {
  const result = await chrome.storage.local.get(['supabaseUrl']);
  return result.supabaseUrl || '';
}

async function getSupabaseAnonKey() {
  const result = await chrome.storage.local.get(['supabaseAnonKey']);
  return result.supabaseAnonKey || '';
}

chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'local') {
    const relevantChanges = ['blockedSites', 'blockedKeywords', 'protectionEnabled', 'isPaused'];
    const hasRelevantChange = Object.keys(changes).some(key => relevantChanges.includes(key));

    if (hasRelevantChange) {
      console.log('Storage changed, updating rules');
      updateBlockingRules();
    }
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('Shield extension installed');
  updateBlockingRules();
});

chrome.runtime.onStartup.addListener(() => {
  console.log('Shield extension started');
  updateBlockingRules();
});

chrome.alarms.create('syncRules', { periodInMinutes: 5 });

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'syncRules') {
    updateBlockingRules();
  }
});

updateBlockingRules();
