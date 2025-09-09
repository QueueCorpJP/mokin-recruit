import React from 'react';
import type { CandidateData } from './CandidateCard';
import SectionTitle from '../ui/SectionTitle';
import SectionText from '../ui/SectionText';
import SectionBlock from '../ui/SectionBlock';
import SectionSubListBlock from '../ui/SectionSubListBlock';
import SectionSubTextBlock from '../ui/SectionSubTextBlock';
import JobHistoryCard from '../ui/JobHistoryCard';
import SelectionStatusRow from '../ui/SelectionStatusRow';
import SkillTagBlock from '../ui/SkillTagBlock';
import { Button } from '../ui/button';

interface Props {
  candidate: CandidateData;
}

const CandidateDetailTabDetail: React.FC<Props> = () => {
  return (
    <div style={{ padding: 24 }}>
      <SectionBlock>
        <SectionTitle>詳細情報</SectionTitle>
        <SectionText>
          職務要約テキストが入ります。職務要約テキストが入ります。職務要約テキストが入ります。職務要約テキストが入ります。職務要約テキストが入ります。職務要約テキストが入ります。職務要約テキストが入ります。職務要約テキストが入ります。職務要約テキストが入ります。職務要約テキストが入ります。職務要約テキストが入ります。
        </SectionText>
      </SectionBlock>
      <SectionBlock>
        <SectionTitle>経験</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 40 }}>
          <SectionSubListBlock
            subTitle='経験職種'
            listItems={[
              '職種テキスト（○年）',
              '職種テキスト（○年）',
              '職種テキスト（○年）',
            ]}
          />
          <SectionSubListBlock
            subTitle='経験業種'
            listItems={[
              '業種テキスト（○年）',
              '業種テキスト（○年）',
              '業種テキスト（○年）',
            ]}
          />
        </div>
      </SectionBlock>
      <SectionBlock>
        <SectionTitle>職務経歴</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <JobHistoryCard />
          <JobHistoryCard />
          <JobHistoryCard />
        </div>
      </SectionBlock>
      <SectionBlock>
        <SectionTitle>希望条件</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SectionSubTextBlock
            subTitle='希望年収'
            text='〇〇万円（直近年収：〇〇万円）'
          />
          <div style={{ display: 'flex', flexDirection: 'row', gap: 40 }}>
            <SectionSubListBlock
              subTitle='希望職種'
              listItems={['職種テキスト', '職種テキスト', '職種テキスト']}
              containerStyle={{ width: '100%' }}
              subTitleStyle={{ width: 140, minWidth: 140, textAlign: 'right' }}
            />
            <SectionSubListBlock
              subTitle='希望業種'
              listItems={['希望業種1', '希望業種2', '希望業種3']}
              containerStyle={{ width: '100%' }}
              subTitleStyle={{ width: 'auto', minWidth: 0, textAlign: 'right' }}
            />
          </div>
          <SectionSubTextBlock
            subTitle='希望勤務地'
            text='勤務地テキスト、勤務地テキスト、勤務地テキスト'
          />
          <SectionSubTextBlock subTitle='転職希望時期' text='3か月以内に' />
          <SectionSubListBlock
            subTitle='興味のある働き方'
            listItems={['働き方1', '働き方2', '働き方3']}
            containerStyle={{ width: '100%' }}
            subTitleStyle={{ width: 140, minWidth: 140, textAlign: 'right' }}
          />
        </div>
      </SectionBlock>
      <SectionBlock>
        <SectionTitle>選考状況</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SelectionStatusRow
            companyName='企業名テキスト企業名テキスト企業名テキスト'
            industryTags={['業種タグ1', '業種タグ2', '業種タグ3']}
            jobTitle='職種テキスト、職種テキスト、職種テキスト'
            interviewResult='面接結果'
            withdrawalReason='辞退理由テキスト辞退理由テキスト辞退理由テキスト'
          />
          <SelectionStatusRow
            companyName='企業名テキスト企業名テキスト企業名テキスト'
            industryTags={['業種タグ1', '業種タグ2', '業種タグ3']}
            jobTitle='職種テキスト、職種テキスト、職種テキスト'
            interviewResult='面接結果'
            withdrawalReason='辞退理由テキスト辞退理由テキスト辞退理由テキスト'
          />
          <SelectionStatusRow
            companyName='企業名テキスト企業名テキスト企業名テキスト'
            industryTags={['業種タグ1', '業種タグ2', '業種タグ3']}
            jobTitle='職種テキスト、職種テキスト、職種テキスト'
            interviewResult='面接結果'
            withdrawalReason='辞退理由テキスト辞退理由テキスト辞退理由テキスト'
          />
          <SelectionStatusRow
            companyName='企業名テキスト企業名テキスト企業名テキスト'
            industryTags={['業種タグ1', '業種タグ2', '業種タグ3']}
            jobTitle='職種テキスト、職種テキスト、職種テキスト'
            interviewResult='面接結果'
            withdrawalReason='辞退理由テキスト辞退理由テキスト辞退理由テキスト'
          />
          <SelectionStatusRow
            companyName='企業名テキスト企業名テキスト企業名テキスト'
            industryTags={['業種タグ1', '業種タグ2', '業種タグ3']}
            jobTitle='職種テキスト、職種テキスト、職種テキスト'
            interviewResult='面接結果'
            withdrawalReason='辞退理由テキスト辞退理由テキスト辞退理由テキスト'
          />
        </div>
      </SectionBlock>
      <SectionBlock>
        <SectionTitle>自己PR・その他</SectionTitle>
        <SectionText>
          自己PR・その他テキストが入ります。自己PR・その他テキストが入ります。自己PR・その他テキストが入ります。自己PR・その他テキストが入ります。自己PR・その他テキストが入ります。自己PR・その他テキストが入ります。自己PR・その他テキストが入ります。自己PR・その他テキストが入ります。自己PR・その他テキストが入ります。自己PR・その他テキストが入ります。自己PR・その他テキストが入ります。
        </SectionText>
      </SectionBlock>
      <SectionBlock>
        <SectionTitle>資格・スキル・語学</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <SectionSubTextBlock
            subTitle='保有資格'
            text='資格テキスト'
            subTitleStyle={{ width: 69, minWidth: 69, textAlign: 'right' }}
          />
          <SkillTagBlock
            subTitle='スキル'
            tags={[
              'スキル1',
              'スキル2',
              'スキル3',
              'スキル4',
              'スキル5',
              'スキル6',
            ]}
          />
          <SectionSubListBlock
            subTitle='語学'
            listItems={['語学1', '語学2', '語学3']}
            containerStyle={{ width: '100%' }}
            subTitleStyle={{ width: 69, minWidth: 69, textAlign: 'right' }}
          />
        </div>
      </SectionBlock>
      <SectionBlock>
        <SectionTitle>学歴</SectionTitle>
        <div style={{ display: 'flex', flexDirection: 'row', gap: 16 }}>
          <SectionText style={{ color: '#323232' }}>
            ○○大学 ○○学部 ○○学科
          </SectionText>
          <SectionText style={{ color: '#999999' }}>
            2020年03月 卒業
          </SectionText>
        </div>
      </SectionBlock>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
        <Button
          variant='blue-gradient'
          size='figma-default'
          style={{
            padding: '14px 40px',
            fontSize: 16,
            lineHeight: 2,
            letterSpacing: '0.1em',
            fontWeight: 'bold',
            fontFamily: 'Noto Sans JP, sans-serif',
          }}
        >
          スカウト送信
        </Button>
      </div>
    </div>
  );
};

export default CandidateDetailTabDetail;
