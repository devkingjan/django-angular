from enum import Enum


class ChoiceEnum(Enum):
    @classmethod
    def choices(cls):
        return tuple((i.name, i.value) for i in cls)

    @classmethod
    def values(cls):
        return list(i.value for i in cls)


class ExperimentEntryTypeChoices(ChoiceEnum):
    NOTEBOOK = 'Notebook'
    PLATE = 'Plate'
    FILE = 'File'
    IMAGE = 'Image'
    TABLE = 'Table'
    TEXT = 'Text'
