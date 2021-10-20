import { useCallback, useRef, useState } from "react";
import { Row, Tooltip } from "antd";
import Button from "@rl/prp-components-library/src/components/Button";
import CardResult from "@rl/prp-components-library/src/components/CardResult";
import Icon from "@rl/prp-components-library/src/components/Icon";
import { CustomStatus } from "@rl/prp-components-library/src/components/Result/Result";
import Space from "@rl/prp-components-library/src/components/Space";
import Table from "@rl/prp-components-library/src/components/Table";
import Text from "@rl/prp-components-library/src/components/Text";
import Title from "@rl/prp-components-library/src/components/Title";
import styled from "styled-components";
import CaseModal from "./CaseModal";
import { useFetchCases } from "../../hooks/cases/hooks";
import * as CONSTANTS from "../../constants/cases";
import CardFetchError from "../../components/CardFetchError";
import ColorStatus from "../../types/ColorStatus";
import { ReactComponent as EditIcon } from "../../assets/icons/edit.svg";
import EditCaseModal from "./CaseModal/EditCaseModal";

const StyledSpace = styled(Space)`
    width: 100%;
    height: 100%;
    > *:last-child {
        height: 100%;
    }
`;

const MyCases = () => {
    const selectedCase = useRef<any>(null);
    const [openCaseModal, setOpenCaseModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const toggleEditModal = useCallback(() => setOpenEditModal(false), []);
    const { handleListChange, sortedField, sortDirection, error, data, loading, refreshList } = useFetchCases();
    const handleClose = useCallback(() => setOpenCaseModal(false), []);

    const getCaseColumns = useCallback(
        () => [
            {
                title: CONSTANTS.CASE_COLUMNS_TITLES[0],
                dataIndex: CONSTANTS.CASE_COLUMNS_FIELDS[0],
                sorter: true,
                sortOrder: sortedField === CONSTANTS.CASE_COLUMNS_FIELDS[0] && sortDirection,
                ellipsis: true,
                render: (text) => (
                    <Tooltip title={text}>
                        <Text>{text}</Text>
                    </Tooltip>
                ),
            },
            {
                title: CONSTANTS.CASE_COLUMNS_TITLES[1],
                dataIndex: CONSTANTS.CASE_COLUMNS_FIELDS[1],
                sorter: true,
                sortOrder: sortedField === CONSTANTS.CASE_COLUMNS_FIELDS[1] && sortDirection,
                ellipsis: true,
                render: (text) => <Text>{text || "-"}</Text>,
            },
            {
                title: CONSTANTS.CASE_COLUMNS_TITLES[2],
                dataIndex: CONSTANTS.CASE_COLUMNS_FIELDS[2],
                sorter: true,
                sortOrder: sortedField === CONSTANTS.CASE_COLUMNS_FIELDS[2] && sortDirection,
                ellipsis: true,
                render: (text) => (
                    <Tooltip title={text}>
                        <Text>{text}</Text>
                    </Tooltip>
                ),
            },
            {
                render: (text) => (
                    <Space justify="flex-end" fullWidth>
                        <Icon
                            data-testid={`${text.id}_edit_icon`}
                            icon={EditIcon}
                            onClick={() => {
                                selectedCase.current = text;
                                setOpenEditModal(true);
                            }}
                            color={ColorStatus.primary}
                            size={8}
                        />
                    </Space>
                ),
            },
        ],
        [sortedField, sortDirection]
    );

    return (
        <>
            <CaseModal handleClose={handleClose} fetchCases={refreshList} open={openCaseModal} />
            <EditCaseModal
                handleClose={toggleEditModal}
                open={openEditModal}
                currentCase={selectedCase.current}
                fetchCases={refreshList}
            />
            {!error && (data === undefined || data?.length > 0) && (
                <StyledSpace direction="vertical" size="small" fullWidth>
                    <Row justify="space-between" style={{ width: "100%" }}>
                        <Title level={4} noMargin weight="light">
                            My Cases
                        </Title>
                        <Button
                            disabled={data === null || loading}
                            onClick={() => setOpenCaseModal(true)}
                            type="primary"
                            htmlType="submit"
                        >
                            ADD CASE
                        </Button>
                    </Row>
                    <Table
                        data-testid="my_cases_table"
                        rowKey="id"
                        loading={loading}
                        dataSource={data || []}
                        columns={getCaseColumns()}
                        onChange={handleListChange}
                        sortDirections={["descend", "ascend"]}
                        pagination={false}
                        vscroll
                        style={{ height: "100%" }}
                    />
                </StyledSpace>
            )}
            {error && <CardFetchError onClick={refreshList} />}
            {!error && data?.length === 0 && (
                <CardResult
                    title={CONSTANTS.EMPTY_STATE_TITLE}
                    subTitle={CONSTANTS.EMPTY_STATE_TEXT}
                    status={CustomStatus.empty}
                    extra={
                        <Button onClick={() => setOpenCaseModal(true)} type="primary">
                            {CONSTANTS.EMPTY_STATE_BUTTON}
                        </Button>
                    }
                />
            )}
        </>
    );
};

export default MyCases;
