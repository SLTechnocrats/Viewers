import React from 'react';
import { AboutModal } from '@ohif/ui-next';
import detect from 'browser-detect';

function AboutModalDefault() {
  const { os, version, name } = detect();
  const browser = `${name[0].toUpperCase()}${name.substr(1)} ${version}`;
  const commitHash = process.env.COMMIT_HASH;

  return (
    <AboutModal className="w-[400px]">
      <AboutModal.ProductName>Smaro Viewer</AboutModal.ProductName>

      <AboutModal.Body>
        <AboutModal.DetailItem
          label="Current Browser & OS"
          value={`${browser}, ${os}`}
        />
        <AboutModal.SocialItem

          url="smaro"
        />
      </AboutModal.Body>
    </AboutModal>
  );
}

export default {
  'ohif.aboutModal': AboutModalDefault,
};
