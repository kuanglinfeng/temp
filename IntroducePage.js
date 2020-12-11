import styled from 'styled-components';
import baySensors from '@shanbay-community/js-utils/dist/baySensors';
import _Back from '@/camp-components/Layout/Basic/Back';
import { useEffect, useRef, useState } from 'react';
import TagMove from '@/utils/TagMove';
import worker from '@/utils/worker';
import useStatusBarHeight from '@/camp-hooks/useStatusBarHeight';
import useFetch from '@/camp-hooks/useFetch';
import { trainPlan } from '@/camp-config/index';
import { PG_SURVEY } from '@/camp-constants/index';

const courseImg =
    'https://media-image1.baydn.com/storage_media_image/zzmmhe/30d5c971d12c430f62566ca2728b00fa.0ee5a06bfbfab2b726229e245f0cf216.png';

const playImg =
    'https://media-image1.baydn.com/storage_media_image/zzmmhe/0b24d668444681e3297878da0b3f79e4.825b233c7d6c155e158f91561846068c.png';

const bgImg =
    'https://media-image1.baydn.com/storage_media_image/klupzt/1663ef5219f50dc06d1f2c9ff48af6f8.c3ab942dea165b78561a63fbb63f4f47.png?x-oss-process=image/format,jpg/quality,q_80';
const Container = styled.div`
    width: 100%;
`;

const Header = styled.div`
    position: relative;
`;

const Back = styled(_Back)`
    position: absolute;
    top: 0;
    left: 0;
`;

const PlayImg = styled.img`
    position: absolute;
    top: 70%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 58px;
    height: 80px;
    box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0);
    object-fit: contain;
    cursor: pointer;
`;

const BgImg = styled.img`
    object-fit: contain;
    width: 100%;
    height: 100%;
`;

const BodyWrapper = styled.div`
    padding: 5%;
`;

const CourseImg = styled.img`
    width: 88px;
    height: 22px;
    margin-bottom: 5px;
    object-fit: contain;
`;

const ContentWrapper = styled.div`
    font-size: 4vw;
    margin-bottom: 30px;
`;

const Title = styled.div`
    font-weight: 700;
`;

const SmallTitle = styled.div`
    font-weight: 400;
    margin: 8px 0 8px 12%;
`;

const Tip = styled.img`
    position: fixed;
    width: 261px;
    height: 70px;
    cursor: pointer;
    right: 0;
    top: 48vw;
    z-index: 20;
`;

const { staticResource } = window;
const TRAIN_PLAN = 1;

// 初始化 worker courseId 固定
worker.init({
    courseId: 1000,
});

const IntroducePage = () => {
    const [showEntry, setShowEntry] = useState(0);
    const tipElm = useRef();
    const statusBarHeight = useStatusBarHeight();

    const [testData, setTestData] = useState('没有触发visibility change');

    const { data } = useFetch(trainPlan.questionnaire(TRAIN_PLAN));
    const playVideo = () => {
        baySensors.track('pg_video_Click', {
            pg_jump_type: -1,
            pg_resource_id: -1,
        });
        setShowEntry(data.is_show);
        window.location.href = `shanbay.native.app://video?url=${staticResource.guideVideo}&type=dialog`;
    };

    const handleNext = () => {
        baySensors.track('pg_survey_click', {
            pg_place: PG_SURVEY.TRAIN_PLAN,
        });
        window.location.href = `${data.questionnaire_url}?bay_is_oinwv=true`;
    };

    useEffect(() => {
        worker.start({
            articleId: 1000,
            action: 0,
            partType: 1,
            paragraphId: 1,
        });
        // 页面推入后台 关闭计时
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                setTestData('visibility 为： 隐藏');
                return worker.pause();
            }
            setTestData('visibility 为： 显示');
            worker.continue();
        });
    }, []);

    useEffect(() => {
        tipElm.current && TagMove(tipElm, statusBarHeight);
    }, [statusBarHeight, showEntry]);

    if (!data) return null;

    return (
        <Container>
            <Header>
                <Back />
                <PlayImg onClick={playVideo} src={playImg} />
                <BgImg src={bgImg} />
            </Header>
            {!!showEntry && (
                <Tip
                    onClick={handleNext}
                    ref={tipElm}
                    src="https://media-image1.baydn.com/storage_media_image/zhmdzg/18fc1ae46b57a269ff7bdf863e54a07d.9686bd1e9364177541d1cec480f6184d.png"
                />
            )}
            <BodyWrapper>
                <CourseImg src={courseImg} />
                <ContentWrapper>
                    <Title>Part1: 避坑指南</Title>
                    <SmallTitle>1. 时间分配</SmallTitle>
                    <SmallTitle>2. 课程选择</SmallTitle>
                    <SmallTitle>3. 四六级对比误区</SmallTitle>
                </ContentWrapper>
                <ContentWrapper>
                    <Title>Part2: 实战考研</Title>
                    <SmallTitle>1. 单词: 如何记忆更牢固</SmallTitle>
                    <SmallTitle>2. 长难句: 怎样快速读懂</SmallTitle>
                    <SmallTitle>3. 阅读: “做对不自信、做错 很焦虑”怎么办</SmallTitle>
                    <SmallTitle>4. 写作: 写作的正确姿势</SmallTitle>
                    <SmallTitle>5. 翻译、完形、新题型</SmallTitle>
                </ContentWrapper>
                <ContentWrapper>
                    <Title>Part3：规划安排</Title>
                    <SmallTitle>1. 阶段设置 </SmallTitle>
                    <SmallTitle>2. 复习回顾/重复回顾</SmallTitle>
                    <SmallTitle>3. 复盘总结</SmallTitle>
                    <SmallTitle>4. 每日任务/每日安排</SmallTitle>
                </ContentWrapper>
            </BodyWrapper>
            <h3>{testData}</h3>
        </Container>
    );
};

export default IntroducePage;
